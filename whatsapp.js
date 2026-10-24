import { CONFIG } from "./config.js";
export const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: CONFIG.moeda });
export const linkWhats = (msg = "Olá! Gostaria de fazer um pedido no Maria Fernanda BISTRÔ.") => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
export function montarMensagem(st, tot) {
  const lista = st.itens.map(i => `• ${i.qtd}x ${i.nome}` + (typeof i.preco === "number" ? ` — ${brl(i.preco * i.qtd)}` : "")).join("\n");
  const pers = st.itens.filter(i => i.acomp?.length).map(i => `• ${i.nome}: ${i.acomp.join(" + ")}`).join("\n") || "Nenhuma";
  const total = tot.completo ? brl(tot.valor) : "a confirmar com o restaurante";
  return `Olá! Gostaria de fazer um pedido no Maria Fernanda BISTRÔ.\n\n*Meu pedido:*\n${lista}\n\n*Acompanhamentos e personalizações:*\n${pers}\n\n*Observações:*\n${st.obs?.trim() || "Nenhuma"}\n\n*Total:* ${total}\n\nAguardo a confirmação do pedido. Obrigado!`;
}
