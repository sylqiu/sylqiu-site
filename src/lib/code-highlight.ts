/**
 * Shared code-block renderer for illustration prose.
 *
 * KV cache and FlashAttention both render runnable snippets in the same chrome:
 * a title bar with language badge, line numbers, and a small token highlighter
 * for Python, CUDA/C++, and shell. Keeping it in one module means both scenes
 * stay visually and behaviorally in sync.
 */

export type CodeLang = "python" | "cuda" | "cpp" | "bash" | "text";

const PY_KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "False", "finally", "for", "from",
  "global", "if", "import", "in", "is", "lambda", "None", "nonlocal", "not",
  "or", "pass", "raise", "return", "True", "try", "while", "with", "yield",
]);

const PY_BUILTINS = new Set([
  "abs", "all", "any", "bool", "bytes", "callable", "dict", "enumerate",
  "float", "format", "getattr", "hasattr", "int", "isinstance", "len", "list",
  "map", "max", "min", "open", "print", "range", "repr", "reversed", "round",
  "set", "setattr", "sorted", "str", "sum", "super", "tuple", "type", "zip",
]);

const PY_TYPES = new Set([
  "Any", "Callable", "Dict", "Iterable", "Iterator", "List", "Literal",
  "Optional", "Sequence", "Tensor", "Tuple", "Type", "Union", "KVBlock",
  "KVTensor", "Protocol", "dataclass", "asyncio", "deque", "jnp", "jax", "pl",
]);

const C_KEYWORDS = new Set([
  "alignas", "alignof", "asm", "auto", "bool", "break", "case", "catch",
  "char", "class", "const", "constexpr", "continue", "decltype", "default",
  "delete", "do", "double", "else", "enum", "explicit", "extern", "false",
  "float", "for", "friend", "goto", "if", "inline", "int", "long", "mutable",
  "namespace", "new", "noexcept", "nullptr", "operator", "private", "protected",
  "public", "register", "reinterpret_cast", "return", "short", "signed",
  "sizeof", "static", "static_cast", "struct", "switch", "template", "this",
  "throw", "true", "try", "typedef", "typename", "union", "unsigned", "using",
  "virtual", "void", "volatile", "while",
]);

const C_TYPES = new Set([
  "half", "half2", "bfloat16", "float", "double", "int8_t", "uint8_t",
  "int16_t", "uint16_t", "int32_t", "uint32_t", "int64_t", "uint64_t",
  "size_t", "ptrdiff_t", "TmaDescriptor", "barrier", "ShapeDtypeStruct",
  "SM90_TMA_LOAD", "SM100_TMA_LOAD", "GMMA", "ScaleOut", "Tensor",
]);

const C_BUILTINS = new Set([
  "__global__", "__device__", "__host__", "__shared__", "__constant__",
  "__restrict__", "__launch_bounds__", "__syncthreads", "threadIdx",
  "blockIdx", "blockDim", "gridDim", "atomicAdd", "cp_async", "wgmma",
  "tcgen05_alloc", "tcgen05_mma", "tcgen05_ld", "tcgen05_st", "tcgen05_commit",
  "make_tma_copy", "copy", "arrive", "wait", "elect_one_sync", "printf",
]);

const BASH_KEYWORDS = new Set([
  "if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case",
  "esac", "function", "in", "export", "local", "return", "source", "cd",
  "echo", "set", "unset", "shift", "exit",
]);

const PY_TOKEN = /(@[A-Za-z_][\w.]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#[^\n]*)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+?)/g;
const C_TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|\/\*.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[fFuUlL]*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+?)/g;
const BASH_TOKEN = /(#[^\n]*)|("(?:\\.|[^"\\])*"|'[^']*')|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+?)/g;

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function normalizeLang(raw: string | null | undefined): CodeLang {
  const value = (raw || "").trim().toLowerCase().replace(/^language-/, "");
  if (!value) return "text";
  if (value === "py" || value === "python" || value === "triton" || value === "pallas") return "python";
  if (value === "cu" || value === "cuda") return "cuda";
  if (value === "c" || value === "cc" || value === "cpp" || value === "c++" || value === "cutlass") return "cpp";
  if (value === "sh" || value === "bash" || value === "shell" || value === "zsh") return "bash";
  return "text";
}

export function inferLang(code: string): CodeLang {
  if (/^\s*#!/.test(code)) return "bash";
  if (/^\s*#(?:include|define|pragma)\b/m.test(code) || /\b__(?:global|device|shared)__\b/.test(code)) return "cuda";
  if (/\b(?:def|class)\s+\w+|^\s*(?:from|import)\s+\w+/m.test(code) || /@triton\.jit/.test(code)) return "python";
  if (/\b(?:std::|template\s*<|namespace)\b/.test(code)) return "cpp";
  return "text";
}

function identClass(
  ident: string,
  lang: CodeLang,
  lastDef: string,
  line: string,
  endIndex: number,
): string {
  const keyword = lang === "python" ? PY_KEYWORDS : lang === "bash" ? BASH_KEYWORDS : C_KEYWORDS;
  if (keyword.has(ident)) return "tok-kw";
  if (lang === "python") {
    if (ident === "None" || ident === "True" || ident === "False") return "tok-lit";
    if (lastDef === "def") return "tok-fn";
    if (lastDef === "class") return "tok-type";
    if (PY_TYPES.has(ident)) return "tok-type";
    if (PY_BUILTINS.has(ident)) return "tok-builtin";
  } else if (lang === "cuda" || lang === "cpp") {
    if (ident === "true" || ident === "false" || ident === "nullptr" || ident === "NULL") return "tok-lit";
    if (C_TYPES.has(ident)) return "tok-type";
    if (C_BUILTINS.has(ident)) return "tok-builtin";
  }
  if (lang !== "bash" && /^\s*\(/.test(line.slice(endIndex))) return "tok-fn";
  return "";
}

export function highlightLine(line: string, lang: CodeLang): string {
  if (lang === "text") return escapeHtml(line) || " ";
  if ((lang === "cuda" || lang === "cpp") && /^\s*#/.test(line)) {
    return '<span class="tok-pre">' + escapeHtml(line) + "</span>";
  }

  const token = lang === "python" ? PY_TOKEN : lang === "bash" ? BASH_TOKEN : C_TOKEN;
  token.lastIndex = 0;

  const isPython = lang === "python";
  let out = "";
  let lastDef = "";
  let match: RegExpExecArray | null;
  while ((match = token.exec(line)) !== null) {
    // Python has a leading decorator group; C and Bash do not.
    const raw = match[0];
    const decorator = isPython ? match[1] : "";
    const str = match[2];
    const comment = isPython ? match[3] : match[1];
    const num = isPython ? match[4] : match[3];
    const ident = isPython ? match[5] : match[4];
    const space = isPython ? match[6] : match[5];
    const op = isPython ? match[7] : match[6];
    if (decorator) {
      out += '<span class="tok-decorator">' + escapeHtml(decorator) + "</span>";
    } else if (str) {
      out += '<span class="tok-str">' + escapeHtml(str) + "</span>";
    } else if (comment) {
      out += '<span class="tok-com">' + escapeHtml(comment) + "</span>";
    } else if (num) {
      out += '<span class="tok-num">' + escapeHtml(num) + "</span>";
    } else if (ident) {
      const cls = identClass(ident, lang, lastDef, line, match.index + raw.length);
      out += cls ? '<span class="' + cls + '">' + escapeHtml(ident) + "</span>" : escapeHtml(ident);
      lastDef = ident;
      continue;
    } else if (space) {
      out += space;
      continue;
    } else if (op) {
      out += '<span class="tok-op">' + escapeHtml(op) + "</span>";
    }
    lastDef = "";
  }
  return out || " ";
}

function langLabel(lang: CodeLang): string {
  if (lang === "python") return "python";
  if (lang === "cuda") return "cuda";
  if (lang === "cpp") return "c++";
  if (lang === "bash") return "bash";
  return "text";
}

/**
 * Replace every <pre> under `root` with the shared code card.
 *
 * Optional attributes on the <pre>:
 *   data-lang  "python" | "cuda" | "cpp" | "bash"
 *   data-title override the title inferred from the preceding <h3>
 *   data-tag   short chip, e.g. "v2 · Ampere"
 */
export function styleCodeBlocks(root: HTMLElement): void {
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.closest(".code-card")) return;
    const codeEl = pre.querySelector("code");
    const raw = (codeEl?.textContent ?? pre.textContent ?? "").replace(/\n$/, "");
    const lang = normalizeLang(
      pre.getAttribute("data-lang") || codeEl?.className || "",
    );
    const resolved = lang === "text" ? inferLang(raw) : lang;

    const previous = pre.previousElementSibling;
    const fallbackTitle = previous && previous.tagName === "H3"
      ? (previous.textContent || "pseudocode").split(":")[0]
      : "pseudocode";
    const title = pre.getAttribute("data-title") || fallbackTitle;
    const tag = pre.getAttribute("data-tag") || "";

    const card = document.createElement("div");
    card.className = "code-card";

    const head = document.createElement("div");
    head.className = "code-head";
    const dots = document.createElement("span");
    dots.className = "code-dots";
    dots.innerHTML = "<i></i><i></i><i></i>";
    const titleEl = document.createElement("span");
    titleEl.className = "code-title";
    titleEl.textContent = title;
    head.append(dots, titleEl);
    if (tag) {
      const tagEl = document.createElement("span");
      tagEl.className = "code-tag";
      tagEl.textContent = tag;
      head.appendChild(tagEl);
    }
    const langEl = document.createElement("span");
    langEl.className = "code-lang";
    langEl.textContent = langLabel(resolved);
    head.appendChild(langEl);

    const newPre = document.createElement("pre");
    const newCode = document.createElement("code");
    const lines = raw.split("\n");
    lines.forEach((line, index) => {
      const row = document.createElement("span");
      row.className = "code-line";
      const ln = document.createElement("span");
      ln.className = "ln";
      ln.textContent = String(index + 1);
      const lc = document.createElement("span");
      lc.className = "lc";
      lc.innerHTML = highlightLine(line, resolved);
      row.append(ln, lc);
      newCode.appendChild(row);
    });
    newPre.appendChild(newCode);
    card.append(head, newPre);
    pre.replaceWith(card);
  });
}
