/*
 * Mini runtime para abrir los prototipos de /design/prototype en el navegador.
 * Soporta lo que usan estos archivos: <helmet>, {{huecos}}, <sc-for>, onClick="{{fn}}"
 * y una clase Component extends DCLogic con renderVals() + setState().
 * No es parte del sitio final: es sólo para ver las maquetas funcionando.
 */
(function () {
  class DCLogic {
    constructor() { this.state = {}; }
    setState(patch) { this.state = Object.assign({}, this.state, patch); render(); }
  }
  window.DCLogic = DCLogic;

  const HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g;
  const look = (scope, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  const interp = (str, scope) => str.replace(HOLE, (_, p) => { const v = look(scope, p); return v == null ? '' : String(v); });

  let host, tpl, inst;

  function proc(node, scope, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'sc-for') {
      const list = look(scope, node.getAttribute('list').replace(/[{}\s]/g, '')) || [];
      const as = node.getAttribute('as');
      list.forEach((item) => { const s = Object.create(scope); s[as] = item; node.childNodes.forEach((c) => proc(c, s, out)); });
      return;
    }
    if (tag === 'sc-if') {
      const v = look(scope, (node.getAttribute('value') || '').replace(/[{}\s]/g, ''));
      if (v) node.childNodes.forEach((c) => proc(c, scope, out));
      return;
    }
    const el = document.createElement(tag);
    for (const a of node.attributes) {
      if (/^on/i.test(a.name)) {
        const m = /\{\{\s*([\w.$]+)\s*\}\}/.exec(a.value);
        const fn = m && look(scope, m[1]);
        if (typeof fn === 'function') el.addEventListener(a.name.slice(2).toLowerCase(), fn);
        continue;
      }
      el.setAttribute(a.name, interp(a.value, scope));
    }
    const target = tag === 'template' ? el.content : el;
    node.childNodes.forEach((c) => proc(c, scope, target));
    out.appendChild(el);
  }

  function render() {
    const vals = inst.renderVals() || {};
    host.innerHTML = '';
    tpl.childNodes.forEach((c) => proc(c, vals, host));
  }

  document.addEventListener('DOMContentLoaded', () => {
    host = document.querySelector('x-dc');
    const helmet = host.querySelector('helmet');
    if (helmet) { [...helmet.childNodes].forEach((n) => document.head.appendChild(n)); helmet.remove(); }
    tpl = document.createElement('div');
    [...host.childNodes].forEach((n) => tpl.appendChild(n));
    const code = document.querySelector('script[type="text/x-dc"]').textContent;
    const Component = new Function('DCLogic', code + '\n;return Component;')(DCLogic);
    inst = new Component();
    if (!inst.state) inst.state = {};
    render();
    document.documentElement.setAttribute('data-ready', '1');
  });
})();
