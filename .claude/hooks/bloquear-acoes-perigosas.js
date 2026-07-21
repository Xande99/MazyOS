#!/usr/bin/env node
// PreToolUse hook (Bash|PowerShell): bloqueia tecnicamente regras que ja
// existem como instrucao no CLAUDE.md/system prompt, mas que dependem hoje
// so de eu "lembrar" de seguir -- isso e o backstop de harness pra elas.
//
// 1) Ler/imprimir conteudo de .env* (nunca .env.example) -- CLAUDE.md raiz,
//    regra de seguranca #2. Regra de deny em permissions.deny cobre o tool
//    Read; esta aqui cobre Bash/PowerShell, onde deny por prefixo
//    (`Bash(cat *)`) nao pega ".env" aparecendo no meio do comando.
// 2) `git push --force`/`-f` em qualquer posicao do comando -- mesma
//    limitacao de prefixo.
// 3) `rm -rf`/`Remove-Item -Recurse -Force` contra alvo catastrofico
//    (raiz, home, drive inteiro, `.git`, wildcard solto) -- NAO bloqueia
//    rm -rf de subpasta nomeada (uso normal de limpeza, ja acontece o
//    tempo todo neste repo).
// 4) `curl`/`wget`/`Invoke-WebRequest` com saida encanada direto pra um
//    shell (`| sh`, `| bash`, `| iex`, `Invoke-Expression`) -- padrao
//    classico de RCE via instalador remoto.
// 5) `psql`/connection string apontando pra host que nao seja
//    localhost/127.0.0.1/::1 -- acesso direto ao Postgres de producao por
//    fora do Supabase client/RLS.
//
// Decisao por regra:
// - .env, rm -rf catastrofico, curl|sh, psql remoto -> "deny" (bloqueio
//   duro). Todas sao "nunca" sem ressalva nas regras de seguranca, ou tem
//   dano irreversivel/sem correcao com um simples "sim" de confirmacao.
// - git push --force -> "ask". Arriscado mas legitimo as vezes (branch
//   pessoal, pedido explicito) -- so confirmacao, nao bloqueio duro.

const fs = require('fs');

function lerStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

let payload;
try {
  payload = JSON.parse(lerStdin());
} catch (e) {
  process.exit(0); // stdin malformado -- nao bloqueia, so nao intercepta
}

const commandOriginal = payload?.tool_input?.command;
if (typeof commandOriginal !== 'string') process.exit(0);

// Remove corpo de heredoc (`<<'EOF' ... EOF` / `<<-EOF ... EOF`) antes de
// escanear -- e texto literal (documentacao, mensagem de commit), nao
// comando executado. Sem isso, qualquer heredoc que MENCIONE um padrao
// perigoso como exemplo (ex: mensagem de commit documentando o que este
// hook bloqueia) dispara falso positivo. Não cobre heredoc alimentando
// `bash`/`sh` diretamente (`bash <<EOF ... EOF`) -- caso raro, nao usado
// neste repo; ficaria pra revisão manual se aparecer.
function removerHeredocs(cmd) {
  return cmd.replace(/<<-?\s*(['"]?)(\w+)\1[\s\S]*?\n\s*\2\b/g, '<<HEREDOC_REMOVIDO>>');
}
const command = removerHeredocs(commandOriginal);

function negar(motivo) {
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: motivo },
  }));
  process.exit(0);
}
function perguntar(motivo) {
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'ask', permissionDecisionReason: motivo },
  }));
  process.exit(0);
}

// --- 1) leitura de .env (nao .env.example) ---
const LEITURA_ENV = /\b(cat|type|more|less|head|tail|bat|Get-Content|gc)\b[^\n]*\.env(?!\S*\.example\b)\S*/i;
if (LEITURA_ENV.test(command)) {
  negar('Bloqueado: comando parece ler/imprimir conteúdo de um arquivo .env (fora de .env.example). Regra do CLAUDE.md: nunca ler, imprimir ou reproduzir .env* — nem em resposta, arquivo ou commit. Pra confirmar que uma variável existe (sem ver o valor), use `Test-Path`/`test -f`, ou peça pro usuário confirmar o valor diretamente.');
}

// --- 2) rm -rf / Remove-Item -Recurse -Force contra alvo catastrofico ---
// So dispara pro alvo inteiro ser raiz/home/drive/.git/wildcard solto --
// "rm -rf pasta/subpasta" (uso normal) nao bate aqui.
const ALVO_CATASTROFICO = /(["']?)(\/|~\/?|\.\/?|\*|[A-Za-z]:[\\/]?|\.git\/?)\1(\s|$)/;
const RM_RF = /\brm\s+(-[a-z]*[rf][a-z]*[rf]?[a-z]*)\s+/i;
const REMOVE_ITEM = /\bRemove-Item\b[^\n]*-Recurse\b[^\n]*-Force\b|\bRemove-Item\b[^\n]*-Force\b[^\n]*-Recurse\b/i;
{
  const mRm = command.match(RM_RF);
  if (mRm && /r/i.test(mRm[1]) && /f/i.test(mRm[1])) {
    const resto = command.slice(mRm.index + mRm[0].length);
    if (ALVO_CATASTROFICO.test(resto)) {
      negar('Bloqueado: rm -rf contra um alvo que parece raiz/home/drive/.git/wildcard solto (ex: /, ~, ., *, C:\\, .git) — risco de apagar tudo, não uma pasta específica. Se o alvo pretendido é isso mesmo, peça pro usuário rodar via `!`.');
    }
  } else if (REMOVE_ITEM.test(command) && ALVO_CATASTROFICO.test(command)) {
    negar('Bloqueado: Remove-Item -Recurse -Force contra um alvo que parece raiz/home/drive/.git/wildcard solto. Se o alvo pretendido é isso mesmo, peça pro usuário rodar via `!`.');
  }
}

// --- 3) curl/wget/Invoke-WebRequest encanado pra shell (RCE via instalador remoto) ---
const PIPE_SHELL = /\b(curl|wget|Invoke-WebRequest|iwr)\b[^\n|]*\|\s*(sudo\s+)?(sh|bash|zsh|pwsh|powershell|iex|Invoke-Expression)\b/i;
const IEX_DOWNLOAD = /(DownloadString|DownloadData)\s*\([^)]*\)\s*\)?\s*\|?\s*(iex|Invoke-Expression)\b|\b(iex|Invoke-Expression)\b[^\n]*(DownloadString|DownloadData)/i;
if (PIPE_SHELL.test(command) || IEX_DOWNLOAD.test(command)) {
  negar('Bloqueado: comando parece baixar conteúdo remoto e executar direto num shell (curl/wget/Invoke-WebRequest encanado pra sh/bash/iex). Risco de supply-chain — baixar o script primeiro, revisar o conteúdo, rodar depois se estiver limpo.');
}

// --- 4) psql / connection string contra host que nao seja local ---
function extrairHostPsql(cmd) {
  if (!/\bpsql\b/i.test(cmd)) return null;
  let m = cmd.match(/-h\s*([^\s'";]+)/i) || cmd.match(/--host[= ]([^\s'";]+)/i) || cmd.match(/\bhost=([^\s'";]+)/i);
  if (m) return m[1];
  m = cmd.match(/postgres(?:ql)?:\/\/[^@\s'"]*@([^:/\s'"]+)/i);
  if (m) return m[1];
  return null;
}
const HOSTS_LOCAIS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);
const hostPsql = extrairHostPsql(command);
if (hostPsql && !HOSTS_LOCAIS.has(hostPsql.toLowerCase())) {
  negar(`Bloqueado: psql conectando direto em "${hostPsql}" (não é localhost). Acesso direto ao Postgres por fora do client/RLS do Supabase, contra host que parece remoto/produção — usar o client de app normal, ou pedir pro usuário rodar via '!' se for intencional.`);
}

// --- 5) git push --force (ask, nao deny) ---
const FORCE_PUSH = /\bgit\s+push\b[^\n]*(--force(?!-with-lease)|(?<!\S)-f\b)/i;
if (FORCE_PUSH.test(command)) {
  perguntar('git push com --force/-f detectado. Confirme: isso foi pedido explicitamente pelo usuário nesta conversa, e não é push pra main/master?');
}

process.exit(0);
