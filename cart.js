const KEY = "mfb-carrinho";
let state = { itens: [], obs: "" };
const subs = new Set();
try { state = JSON.parse(localStorage.getItem(KEY)) || state; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} subs.forEach(f => f(state)); };
export const onChange = f => { subs.add(f); f(state); };
const chave = (id, ac) => id + "|" + (ac || []).slice().sort().join(",");
export function add(prod, qtd = 1, acomp = null) {
  const k = chave(prod.id, acomp);
  const ex = state.itens.find(i => i.k === k);
  if (ex) ex.qtd += qtd;
  else state.itens.push({ k, id: prod.id, nome: prod.nome, preco: prod.preco, qtd, acomp });
  save();
}
export function setQtd(k, q) { const i = state.itens.find(x => x.k === k); if (!i) return; i.qtd = Math.max(0, q); state.itens = state.itens.filter(x => x.qtd > 0); save(); }
export const remove = k => { state.itens = state.itens.filter(x => x.k !== k); save(); };
export const setObs = t => { state.obs = t; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
export const get = () => state;
export const count = () => state.itens.reduce((a, i) => a + i.qtd, 0);
export function total() {
  const p = state.itens.filter(i => typeof i.preco === "number");
  return { valor: p.reduce((a, i) => a + i.preco * i.qtd, 0), completo: p.length === state.itens.length && p.length > 0 };
}
