---
description: Revisão mensal de dependências — desatualizadas, CVEs, cooldown de 72h, plano de update
---

Rode uma revisão de dependências em todos os projetos com `package.json` dentro de `projeto/` (dashboard, Ribas Suplementos e qualquer outro cliente ativo) e nos templates (`templates/starter-tipo-a/`, `templates/starter-tipo-b/`). Para cada um:

1. Rodar `npm outdated` e `npm run deps:audit` (equivalente a `npm audit --audit-level=high`) dentro do projeto.
2. Para cada dependência desatualizada, checar a data de publicação da versão nova (`npm view <pacote>@<versão> time.<versão>` ou `npm view <pacote> time --json`) — **nunca propor atualizar para uma versão publicada há menos de 72h** (mitiga supply-chain attack via versão recém-publicada e ainda não escrutinada pela comunidade). Se a versão mais nova tiver menos de 72h, propor a penúltima versão estável, ou esperar.
3. Cruzar `npm audit` com a lista de CVEs conhecidas — se houver alta/crítica sem fix limpo disponível (ex: caso já documentado do `postcss` vendorizado no Next em `_memoria/licoes-tecnicas.md`), não forçar downgrade de pacote maior (`--force`) sem aprovação explícita.
4. Montar um plano de update priorizado: primeiro CVEs alta/crítica com fix limpo, depois patch/minor com >72h de idade, por último major (que exige teste manual e não deve ser automatizado).
5. Nunca rodar `npm install`/`npm update` de verdade nesta skill — é só diagnóstico e plano. Aplicar update é uma tarefa separada, com aprovação explícita por pacote (esp. em major version).
6. Reportar em formato de tabela por projeto: pacote, versão atual, versão alvo, idade da versão alvo, motivo (CVE / manutenção / nenhum — pode esperar).

Regra do CLAUDE.md raiz (seção Segurança) se aplica: dependência nova só entra pinada em versão exata, depois de checar idade (mín. 72h) e reputação. Este comando existe pra não cair na "armadilha do pinning" — pin sem revisão periódica significa nunca receber patch de segurança, então essa revisão precisa rodar mensalmente (registrado como rotina recorrente em `ACOES-MANUAIS.md`).
