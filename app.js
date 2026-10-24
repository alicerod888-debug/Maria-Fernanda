import { CONFIG, ACOMPANHAMENTOS } from "./config.js";
import { CATEGORIAS } from "./products.js";
import * as cart from "./cart.js";
import { brl, linkWhats, montarMensagem } from "./whatsapp.js";
const $ = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Links fixos
document.querySelectorAll("[data-wa]").forEach(a => a.href = linkWhats());
document.querySelectorAll("[data-ig]").forEach(a => a.href = CONFIG.instagramUrl);
document.querySelectorAll("[data-maps]").forEach(a => a.href = CONFIG.mapsUrl);
document.querySelectorAll("[data-tel]").forEach(a => a.href = CONFIG.telefoneLink);

// Abertura
const intro = $("#intro"), vid = $("#intro-video");
const fechar = () => { intro.classList.add("saindo"); setTimeout(() => intro.remove(), 900); sessionStorage.setItem("mfb-intro", "1"); };
if (sessionStorage.getItem("mfb-intro")) intro.remove();
else { vid.addEventListener("ended", fechar); vid.addEventListener("error", fechar); $("#intro-pular").onclick = fechar; setTimeout(fechar, 10000); vid.play?.().catch(() => {}); }

// Cardápio
const nav = $("#cat-nav"), menu = $("#cardapio-lista");
CATEGORIAS.forEach(c => {
  nav.append(Object.assign(el("a", "chip", esc(c.nome)), { href: "#" + c.id }));
  const sec = el("section", "categoria"); sec.id = c.id;
  sec.innerHTML = `<h3>${esc(c.nome)}</h3><p class="qtd">${c.itens.length} itens previstos</p>`;
  const grid = el("div", "grid");
  c.itens.forEach(p => {
    const ok = !!p.nome.trim();
    const card = el("article", "card" + (ok ? "" : " vazio"));
    card.innerHTML = `<div class="foto">${p.foto ? `<img loading="lazy" src="${esc(p.foto)}" alt="${esc(p.nome)}">` : ""}</div>
      <h4>${ok ? esc(p.nome) : "Item a cadastrar"}</h4>
      ${p.descricao ? `<p class="desc">${esc(p.descricao)}</p>` : ""}
      <p class="preco">${typeof p.preco === "number" ? brl(p.preco) : "Preço a cadastrar"}</p>
      <div class="acoes"><div class="qtd-ctl"><button aria-label="Diminuir">−</button><output>1</output><button aria-label="Aumentar">+</button></div>
      <button class="btn pri add" ${ok ? "" : "disabled"}>Adicionar ao Pedido</button></div>`;
    const out = $("output", card), [menos, mais] = card.querySelectorAll(".qtd-ctl button");
    menos.onclick = () => out.textContent = Math.max(1, +out.textContent - 1);
    mais.onclick = () => out.textContent = +out.textContent + 1;
    $(".add", card).onclick = () => {
      const q = +out.textContent;
      if (c.acompanhamentos) abrirPers(p, q); else { cart.add(p, q); out.textContent = 1; toast("Adicionado ao pedido"); }
    };
    grid.append(card);
  });
  sec.append(grid); menu.append(sec);
});

// Personalização das parmegianas
const dlg = $("#pers"), lista = $("#pers-lista"), ok = $("#pers-ok"), aviso = $("#pers-aviso");
ACOMPANHAMENTOS.forEach((a, i) => lista.insertAdjacentHTML("beforeend", `<label><input type="checkbox" value="${esc(a)}"> ${esc(a)}</label>`));
let atual = null;
const sel = () => [...lista.querySelectorAll("input:checked")].map(i => i.value);
lista.addEventListener("change", e => {
  const s = sel();
  if (s.length > 2) e.target.checked = false;
  const n = sel().length;
  aviso.textContent = `Selecionados: ${n} de 2`; ok.disabled = n !== 2;
});
function abrirPers(p, q) { atual = { p, q }; lista.querySelectorAll("input").forEach(i => i.checked = false); aviso.textContent = "Selecionados: 0 de 2"; ok.disabled = true; $("#pers-nome").textContent = p.nome; dlg.showModal(); }
ok.onclick = e => { e.preventDefault(); if (sel().length !== 2) return; cart.add(atual.p, atual.q, sel()); dlg.close(); toast("Adicionado ao pedido"); };
$("#pers-cancel").onclick = () => dlg.close();

// Carrinho
const drawer = $("#carrinho"), itensEl = $("#carrinho-itens");
const abrir = v => { drawer.classList.toggle("aberto", v); drawer.setAttribute("aria-hidden", !v); };
document.querySelectorAll("[data-abrir-carrinho]").forEach(b => b.onclick = () => abrir(true));
$("#carrinho-fechar").onclick = () => abrir(false);
$("#obs").addEventListener("input", e => cart.setObs(e.target.value));
$("#obs").value = cart.get().obs || "";
cart.onChange(st => {
  $("#badge").textContent = cart.count();
  itensEl.innerHTML = st.itens.length ? "" : '<p class="vazio-msg">Seu pedido está vazio.</p>';
  st.itens.forEach(i => {
    const r = el("div", "linha");
    r.innerHTML = `<div><strong>${esc(i.nome)}</strong>${i.acomp ? `<small>${esc(i.acomp.join(" + "))}</small>` : ""}<small>${typeof i.preco === "number" ? brl(i.preco * i.qtd) : "Preço a confirmar"}</small></div>
      <div class="qtd-ctl"><button aria-label="Diminuir">−</button><output>${i.qtd}</output><button aria-label="Aumentar">+</button></div>
      <button class="rm" aria-label="Remover">✕</button>`;
    const [m, p] = r.querySelectorAll(".qtd-ctl button");
    m.onclick = () => cart.setQtd(i.k, i.qtd - 1); p.onclick = () => cart.setQtd(i.k, i.qtd + 1); $(".rm", r).onclick = () => cart.remove(i.k);
    itensEl.append(r);
  });
  const t = cart.total();
  $("#total").textContent = st.itens.length ? (t.completo ? brl(t.valor) : "A confirmar com o restaurante") : "—";
  const fin = $("#finalizar"); fin.setAttribute("aria-disabled", !st.itens.length);
  fin.href = st.itens.length ? linkWhats(montarMensagem(st, t)) : "#";
});
$("#finalizar").addEventListener("click", e => { if (!cart.count()) { e.preventDefault(); return; } e.currentTarget.href = linkWhats(montarMensagem(cart.get(), cart.total())); });

function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 1800); }
