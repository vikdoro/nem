import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './gin-rule-editor.js';
import './gin-icons.js';
import './gin-shared-styles.js';
import { GinLocalizeMixin } from './gin-localize-mixin.js';

/*@license
    Papa Parse
    v4.5.0
    https://github.com/mholt/PapaParse
    License: MIT
*/
!function (e, t) { "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t() }(window, function () { "use strict"; var s, e, f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {}, r = !f.document && !!f.postMessage, o = r && /(\?|&)papaworker(=|&|$)/.test(f.location.search), a = !1, h = {}, u = 0, v = { parse: function (e, t) { var i = (t = t || {}).dynamicTyping || !1; M(i) && (t.dynamicTypingFunction = i, i = {}); if (t.dynamicTyping = i, t.transform = !!M(t.transform) && t.transform, t.worker && v.WORKERS_SUPPORTED) { var n = function () { if (!v.WORKERS_SUPPORTED) return !1; if (!a && null === v.SCRIPT_PATH) throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually."); var e = v.SCRIPT_PATH || s; e += (-1 !== e.indexOf("?") ? "&" : "?") + "papaworker"; var t = new f.Worker(e); return t.onmessage = y, t.id = u++ , h[t.id] = t }(); return n.userStep = t.step, n.userChunk = t.chunk, n.userComplete = t.complete, n.userError = t.error, t.step = M(t.step), t.chunk = M(t.chunk), t.complete = M(t.complete), t.error = M(t.error), delete t.worker, void n.postMessage({ input: e, config: t, workerId: n.id }) } var r = null; { if (e === v.NODE_STREAM_INPUT) return (r = new g(t)).getStream(); "string" == typeof e ? r = t.download ? new l(t) : new _(t) : !0 === e.readable && M(e.read) && M(e.on) ? r = new m(t) : (f.File && e instanceof File || e instanceof Object) && (r = new p(t)) } return r.stream(e) }, unparse: function (e, t) { var n = !1, f = !0, d = ",", c = "\r\n", r = '"'; !function () { if ("object" != typeof t) return; "string" == typeof t.delimiter && 1 === t.delimiter.length && -1 === v.BAD_DELIMITERS.indexOf(t.delimiter) && (d = t.delimiter); ("boolean" == typeof t.quotes || t.quotes instanceof Array) && (n = t.quotes); "string" == typeof t.newline && (c = t.newline); "string" == typeof t.quoteChar && (r = t.quoteChar); "boolean" == typeof t.header && (f = t.header) }(); var s = new RegExp(r, "g"); "string" == typeof e && (e = JSON.parse(e)); if (e instanceof Array) { if (!e.length || e[0] instanceof Array) return a(null, e); if ("object" == typeof e[0]) return a(i(e[0]), e) } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), e.data instanceof Array && (e.fields || (e.fields = e.meta && e.meta.fields), e.fields || (e.fields = e.data[0] instanceof Array ? e.fields : i(e.data[0])), e.data[0] instanceof Array || "object" == typeof e.data[0] || (e.data = [e.data])), a(e.fields || [], e.data || []); throw "exception: Unable to serialize unrecognized input"; function i(e) { if ("object" != typeof e) return []; var t = []; for (var i in e) t.push(i); return t } function a(e, t) { var i = ""; "string" == typeof e && (e = JSON.parse(e)), "string" == typeof t && (t = JSON.parse(t)); var n = e instanceof Array && 0 < e.length, r = !(t[0] instanceof Array); if (n && f) { for (var s = 0; s < e.length; s++)0 < s && (i += d), i += l(e[s], s); 0 < t.length && (i += c) } for (var a = 0; a < t.length; a++) { for (var o = n ? e.length : t[a].length, h = 0; h < o; h++) { 0 < h && (i += d); var u = n && r ? e[h] : h; i += l(t[a][u], h) } a < t.length - 1 && (i += c) } return i } function l(e, t) { if (null == e) return ""; if (e.constructor === Date) return JSON.stringify(e).slice(1, 25); e = e.toString().replace(s, r + r); var i = "boolean" == typeof n && n || n instanceof Array && n[t] || function (e, t) { for (var i = 0; i < t.length; i++)if (-1 < e.indexOf(t[i])) return !0; return !1 }(e, v.BAD_DELIMITERS) || -1 < e.indexOf(d) || " " === e.charAt(0) || " " === e.charAt(e.length - 1); return i ? r + e + r : e } } }; if (v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\ufeff", v.BAD_DELIMITERS = ["\r", "\n", '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !r && !!f.Worker, v.SCRIPT_PATH = null, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = k, v.ParserHandle = i, v.NetworkStreamer = l, v.FileStreamer = p, v.StringStreamer = _, v.ReadableStreamStreamer = m, v.DuplexStreamStreamer = g, f.jQuery) { var d = f.jQuery; d.fn.parse = function (o) { var i = o.config || {}, h = []; return this.each(function (e) { if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length) return !0; for (var t = 0; t < this.files.length; t++)h.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i) }) }), e(), this; function e() { if (0 !== h.length) { var e, t, i, n, r = h[0]; if (M(o.before)) { var s = o.before(r.file, r.inputElem); if ("object" == typeof s) { if ("abort" === s.action) return e = "AbortError", t = r.file, i = r.inputElem, n = s.reason, void (M(o.error) && o.error({ name: e }, t, i, n)); if ("skip" === s.action) return void u(); "object" == typeof s.config && (r.instanceConfig = d.extend(r.instanceConfig, s.config)) } else if ("skip" === s) return void u() } var a = r.instanceConfig.complete; r.instanceConfig.complete = function (e) { M(a) && a(e, r.file, r.inputElem), u() }, v.parse(r.file, r.instanceConfig) } else M(o.complete) && o.complete() } function u() { h.splice(0, 1), e() } } } function c(e) { this._handle = null, this._finished = !1, this._completed = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = { data: [], errors: [], meta: {} }, function (e) { var t = w(e); t.chunkSize = parseInt(t.chunkSize), e.step || e.chunk || (t.chunkSize = null); this._handle = new i(t), (this._handle.streamer = this)._config = t }.call(this, e), this.parseChunk = function (e, t) { if (this.isFirstChunk && M(this._config.beforeFirstChunk)) { var i = this._config.beforeFirstChunk(e); void 0 !== i && (e = i) } this.isFirstChunk = !1; var n = this._partialLine + e; this._partialLine = ""; var r = this._handle.parse(n, this._baseIndex, !this._finished); if (!this._handle.paused() && !this._handle.aborted()) { var s = r.meta.cursor; this._finished || (this._partialLine = n.substring(s - this._baseIndex), this._baseIndex = s), r && r.data && (this._rowCount += r.data.length); var a = this._finished || this._config.preview && this._rowCount >= this._config.preview; if (o) f.postMessage({ results: r, workerId: v.WORKER_ID, finished: a }); else if (M(this._config.chunk) && !t) { if (this._config.chunk(r, this._handle), this._handle.paused() || this._handle.aborted()) return; r = void 0, this._completeResults = void 0 } return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r.data), this._completeResults.errors = this._completeResults.errors.concat(r.errors), this._completeResults.meta = r.meta), this._completed || !a || !M(this._config.complete) || r && r.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), a || r && r.meta.paused || this._nextChunk(), r } }, this._sendError = function (e) { M(this._config.error) ? this._config.error(e) : o && this._config.error && f.postMessage({ workerId: v.WORKER_ID, error: e, finished: !1 }) } } function l(e) { var n; (e = e || {}).chunkSize || (e.chunkSize = v.RemoteChunkSize), c.call(this, e), this._nextChunk = r ? function () { this._readChunk(), this._chunkLoaded() } : function () { this._readChunk() }, this.stream = function (e) { this._input = e, this._nextChunk() }, this._readChunk = function () { if (this._finished) this._chunkLoaded(); else { if (n = new XMLHttpRequest, this._config.withCredentials && (n.withCredentials = this._config.withCredentials), r || (n.onload = E(this._chunkLoaded, this), n.onerror = E(this._chunkError, this)), n.open("GET", this._input, !r), this._config.downloadRequestHeaders) { var e = this._config.downloadRequestHeaders; for (var t in e) n.setRequestHeader(t, e[t]) } if (this._config.chunkSize) { var i = this._start + this._config.chunkSize - 1; n.setRequestHeader("Range", "bytes=" + this._start + "-" + i), n.setRequestHeader("If-None-Match", "webkit-no-cache") } try { n.send() } catch (e) { this._chunkError(e.message) } r && 0 === n.status ? this._chunkError() : this._start += this._config.chunkSize } }, this._chunkLoaded = function () { 4 === n.readyState && (n.status < 200 || 400 <= n.status ? this._chunkError() : (this._finished = !this._config.chunkSize || this._start > function (e) { var t = e.getResponseHeader("Content-Range"); if (null === t) return -1; return parseInt(t.substr(t.lastIndexOf("/") + 1)) }(n), this.parseChunk(n.responseText))) }, this._chunkError = function (e) { var t = n.statusText || e; this._sendError(new Error(t)) } } function p(e) { var n, r; (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), c.call(this, e); var s = "undefined" != typeof FileReader; this.stream = function (e) { this._input = e, r = e.slice || e.webkitSlice || e.mozSlice, s ? ((n = new FileReader).onload = E(this._chunkLoaded, this), n.onerror = E(this._chunkError, this)) : n = new FileReaderSync, this._nextChunk() }, this._nextChunk = function () { this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk() }, this._readChunk = function () { var e = this._input; if (this._config.chunkSize) { var t = Math.min(this._start + this._config.chunkSize, this._input.size); e = r.call(e, this._start, t) } var i = n.readAsText(e, this._config.encoding); s || this._chunkLoaded({ target: { result: i } }) }, this._chunkLoaded = function (e) { this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e.target.result) }, this._chunkError = function () { this._sendError(n.error) } } function _(e) { var i; c.call(this, e = e || {}), this.stream = function (e) { return i = e, this._nextChunk() }, this._nextChunk = function () { if (!this._finished) { var e = this._config.chunkSize, t = e ? i.substr(0, e) : i; return i = e ? i.substr(e) : "", this._finished = !i, this.parseChunk(t) } } } function m(e) { c.call(this, e = e || {}); var t = [], i = !0, n = !1; this.pause = function () { c.prototype.pause.apply(this, arguments), this._input.pause() }, this.resume = function () { c.prototype.resume.apply(this, arguments), this._input.resume() }, this.stream = function (e) { this._input = e, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError) }, this._checkIsFinished = function () { n && 1 === t.length && (this._finished = !0) }, this._nextChunk = function () { this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i = !0 }, this._streamData = E(function (e) { try { t.push("string" == typeof e ? e : e.toString(this._config.encoding)), i && (i = !1, this._checkIsFinished(), this.parseChunk(t.shift())) } catch (e) { this._streamError(e) } }, this), this._streamError = E(function (e) { this._streamCleanUp(), this._sendError(e) }, this), this._streamEnd = E(function () { this._streamCleanUp(), n = !0, this._streamData("") }, this), this._streamCleanUp = E(function () { this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError) }, this) } function g(e) { var t = require("stream").Duplex, i = w(e), n = !0, r = !1, s = [], a = null; this._onCsvData = function (e) { for (var t = e.data, i = 0; i < t.length; i++)a.push(t[i]) || this._handle.paused() || this._handle.pause() }, this._onCsvComplete = function () { a.push(null) }, i.step = E(this._onCsvData, this), i.complete = E(this._onCsvComplete, this), c.call(this, i), this._nextChunk = function () { r && 1 === s.length && (this._finished = !0), s.length ? s.shift()() : n = !0 }, this._addToParseQueue = function (e, t) { s.push(E(function () { if (this.parseChunk("string" == typeof e ? e : e.toString(i.encoding)), M(t)) return t() }, this)), n && (n = !1, this._nextChunk()) }, this._onRead = function () { this._handle.paused() && this._handle.resume() }, this._onWrite = function (e, t, i) { this._addToParseQueue(e, i) }, this._onWriteComplete = function () { r = !0, this._addToParseQueue("") }, this.getStream = function () { return a }, (a = new t({ readableObjectMode: !0, decodeStrings: !1, read: E(this._onRead, this), write: E(this._onWrite, this) })).once("finish", E(this._onWriteComplete, this)) } function i(m) { var s, a, o, n = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i, r = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/, t = this, i = 0, h = 0, u = !1, e = !1, f = [], d = { data: [], errors: [], meta: {} }; if (M(m.step)) { var c = m.step; m.step = function (e) { if (d = e, p()) l(); else { if (l(), 0 === d.data.length) return; i += e.data.length, m.preview && i > m.preview ? a.abort() : c(d, t) } } } function l() { if (d && o && (g("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), o = !1), m.skipEmptyLines) for (var e = 0; e < d.data.length; e++)1 === d.data[e].length && "" === d.data[e][0] && d.data.splice(e--, 1); return p() && function () { if (!d) return; for (var e = 0; p() && e < d.data.length; e++)for (var t = 0; t < d.data[e].length; t++) { var i = d.data[e][t]; m.trimHeaders && (i = i.trim()), f.push(i) } d.data.splice(0, 1) }(), function () { if (!d || !m.header && !m.dynamicTyping && !m.transform) return d; for (var e = 0; e < d.data.length; e++) { var t, i = m.header ? {} : []; for (t = 0; t < d.data[e].length; t++) { var n = t, r = d.data[e][t]; m.header && (n = t >= f.length ? "__parsed_extra" : f[t]), m.transform && (r = m.transform(r, n)), r = _(n, r), "__parsed_extra" === n ? (i[n] = i[n] || [], i[n].push(r)) : i[n] = r } d.data[e] = i, m.header && (t > f.length ? g("FieldMismatch", "TooManyFields", "Too many fields: expected " + f.length + " fields but parsed " + t, h + e) : t < f.length && g("FieldMismatch", "TooFewFields", "Too few fields: expected " + f.length + " fields but parsed " + t, h + e)) } m.header && d.meta && (d.meta.fields = f); return h += d.data.length, d }() } function p() { return m.header && 0 === f.length } function _(e, t) { return i = e, m.dynamicTypingFunction && void 0 === m.dynamicTyping[i] && (m.dynamicTyping[i] = m.dynamicTypingFunction(i)), !0 === (m.dynamicTyping[i] || m.dynamicTyping) ? "true" === t || "TRUE" === t || "false" !== t && "FALSE" !== t && (n.test(t) ? parseFloat(t) : r.test(t) ? new Date(t) : "" === t ? null : t) : t; var i } function g(e, t, i, n) { d.errors.push({ type: e, code: t, message: i, row: n }) } this.parse = function (e, t, i) { if (m.newline || (m.newline = function (e) { var t = (e = e.substr(0, 1048576)).split("\r"), i = e.split("\n"), n = 1 < i.length && i[0].length < t[0].length; if (1 === t.length || n) return "\n"; for (var r = 0, s = 0; s < t.length; s++)"\n" === t[s][0] && r++; return r >= t.length / 2 ? "\r\n" : "\r" }(e)), o = !1, m.delimiter) M(m.delimiter) && (m.delimiter = m.delimiter(e), d.meta.delimiter = m.delimiter); else { var n = function (e, t, i, n) { for (var r, s, a, o = [",", "\t", "|", ";", v.RECORD_SEP, v.UNIT_SEP], h = 0; h < o.length; h++) { var u = o[h], f = 0, d = 0, c = 0; a = void 0; for (var l = new k({ comments: n, delimiter: u, newline: t, preview: 10 }).parse(e), p = 0; p < l.data.length; p++)if (i && 1 === l.data[p].length && 0 === l.data[p][0].length) c++; else { var _ = l.data[p].length; d += _, void 0 !== a ? 1 < _ && (f += Math.abs(_ - a), a = _) : a = _ } 0 < l.data.length && (d /= l.data.length - c), (void 0 === s || f < s) && 1.99 < d && (s = f, r = u) } return { successful: !!(m.delimiter = r), bestDelimiter: r } }(e, m.newline, m.skipEmptyLines, m.comments); n.successful ? m.delimiter = n.bestDelimiter : (o = !0, m.delimiter = v.DefaultDelimiter), d.meta.delimiter = m.delimiter } var r = w(m); return m.preview && m.header && r.preview++ , s = e, a = new k(r), d = a.parse(s, t, i), l(), u ? { meta: { paused: !0 } } : d || { meta: { paused: !1 } } }, this.paused = function () { return u }, this.pause = function () { u = !0, a.abort(), s = s.substr(a.getCharIndex()) }, this.resume = function () { u = !1, t.streamer.parseChunk(s, !0) }, this.aborted = function () { return e }, this.abort = function () { e = !0, a.abort(), d.meta.aborted = !0, M(m.complete) && m.complete(d), s = "" } } function k(e) { var S, x = (e = e || {}).delimiter, T = e.newline, O = e.comments, I = e.step, D = e.preview, P = e.fastMode, A = S = void 0 === e.quoteChar ? '"' : e.quoteChar; if (void 0 !== e.escapeChar && (A = e.escapeChar), ("string" != typeof x || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = ","), O === x) throw "Comment character same as delimiter"; !0 === O ? O = "#" : ("string" != typeof O || -1 < v.BAD_DELIMITERS.indexOf(O)) && (O = !1), "\n" !== T && "\r" !== T && "\r\n" !== T && (T = "\n"); var L = 0, F = !1; this.parse = function (n, t, i) { if ("string" != typeof n) throw "Input must be a string"; var r = n.length, e = x.length, s = T.length, a = O.length, o = M(I), h = [], u = [], f = [], d = L = 0; if (!n) return E(); if (P || !1 !== P && -1 === n.indexOf(S)) { for (var c = n.split(T), l = 0; l < c.length; l++) { if (f = c[l], L += f.length, l !== c.length - 1) L += T.length; else if (i) return E(); if (!O || f.substr(0, a) !== O) { if (o) { if (h = [], y(f.split(x)), R(), F) return E() } else y(f.split(x)); if (D && D <= l) return h = h.slice(0, D), E(!0) } } return E() } for (var p, _ = n.indexOf(x, L), m = n.indexOf(T, L), g = new RegExp(A.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&") + S, "g"); ;)if (n[L] !== S) if (O && 0 === f.length && n.substr(L, a) === O) { if (-1 === m) return E(); L = m + s, m = n.indexOf(T, L), _ = n.indexOf(x, L) } else if (-1 !== _ && (_ < m || -1 === m)) f.push(n.substring(L, _)), L = _ + e, _ = n.indexOf(x, L); else { if (-1 === m) break; if (f.push(n.substring(L, m)), w(m + s), o && (R(), F)) return E(); if (D && h.length >= D) return E(!0) } else for (p = L, L++; ;) { if (-1 === (p = n.indexOf(S, p + 1))) return i || u.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h.length, index: L }), b(); if (p === r - 1) return b(n.substring(L, p).replace(g, S)); if (S !== A || n[p + 1] !== A) { if (S === A || 0 === p || n[p - 1] !== A) { var v = C(_); if (n[p + 1 + v] === x) { f.push(n.substring(L, p).replace(g, S)), L = p + 1 + v + e, _ = n.indexOf(x, L), m = n.indexOf(T, L); break } var k = C(m); if (n.substr(p + 1 + k, s) === T) { if (f.push(n.substring(L, p).replace(g, S)), w(p + 1 + k + s), _ = n.indexOf(x, L), o && (R(), F)) return E(); if (D && h.length >= D) return E(!0); break } u.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h.length, index: L }), p++ } } else p++ } return b(); function y(e) { h.push(e), d = L } function C(e) { var t = 0; if (-1 !== e) { var i = n.substring(p + 1, e); i && "" === i.trim() && (t = i.length) } return t } function b(e) { return i || (void 0 === e && (e = n.substr(L)), f.push(e), L = r, y(f), o && R()), E() } function w(e) { L = e, y(f), f = [], m = n.indexOf(T, L) } function E(e) { return { data: h, errors: u, meta: { delimiter: x, linebreak: T, aborted: F, truncated: !!e, cursor: d + (t || 0) } } } function R() { I(E()), h = [], u = [] } }, this.abort = function () { F = !0 }, this.getCharIndex = function () { return L } } function y(e) { var t = e.data, i = h[t.workerId], n = !1; if (t.error) i.userError(t.error, t.file); else if (t.results && t.results.data) { var r = { abort: function () { n = !0, C(t.workerId, { data: [], errors: [], meta: { aborted: !0 } }) }, pause: b, resume: b }; if (M(i.userStep)) { for (var s = 0; s < t.results.data.length && (i.userStep({ data: [t.results.data[s]], errors: t.results.errors, meta: t.results.meta }, r), !n); s++); delete t.results } else M(i.userChunk) && (i.userChunk(t.results, r, t.file), delete t.results) } t.finished && !n && C(t.workerId, t.results) } function C(e, t) { var i = h[e]; M(i.userComplete) && i.userComplete(t), i.terminate(), delete h[e] } function b() { throw "Not implemented." } function w(e) { if ("object" != typeof e || null === e) return e; var t = e instanceof Array ? [] : {}; for (var i in e) t[i] = w(e[i]); return t } function E(e, t) { return function () { e.apply(t, arguments) } } function M(e) { return "function" == typeof e } return o ? f.onmessage = function (e) { var t = e.data; void 0 === v.WORKER_ID && t && (v.WORKER_ID = t.workerId); if ("string" == typeof t.input) f.postMessage({ workerId: v.WORKER_ID, results: v.parse(t.input, t.config), finished: !0 }); else if (f.File && t.input instanceof File || t.input instanceof Object) { var i = v.parse(t.input, t.config); i && f.postMessage({ workerId: v.WORKER_ID, results: i, finished: !0 }) } } : v.WORKERS_SUPPORTED && (e = document.getElementsByTagName("script"), s = e.length ? e[e.length - 1].src : "", document.body ? document.addEventListener("DOMContentLoaded", function () { a = !0 }, !0) : a = !0), (l.prototype = Object.create(c.prototype)).constructor = l, (p.prototype = Object.create(c.prototype)).constructor = p, (_.prototype = Object.create(_.prototype)).constructor = _, (m.prototype = Object.create(c.prototype)).constructor = m, (g.prototype = Object.create(c.prototype)).constructor = g, v });

class ginRuleList extends GinLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
    <style is="custom-style" include="iron-flex iron-flex-alignment gin-shared-styles">
      :host {
        display: block;
        padding-bottom: 400px;
      }
      #top-bar {
        margin: 56px 0 80px;
      }
      #search-field input {
        padding: 4px 0 6px 4px;
      }
      #search-field iron-icon {
        --iron-icon-fill-color: var(--gin-grey-100);
        margin: 0 0 1px 4px;
        transition: 200ms fill;
      }
      #search-field:hover iron-icon {
        --iron-icon-fill-color: var(--gin-grey-300);
      }
      #search-field:hover input {
        border-color: var(--gin-grey-200);
        --iron-icon-fill-color: var(--gin-grey-300);
      }
      gin-rule-editor {
        width: 100%;
        box-sizing: border-box;
        margin: 0 auto;
      }
      #side-action-container {
        position: absolute;
        top: 0;
        right: 0px;
        border-radius: 5px;
      }
      #side-action-container iron-icon {
        --iron-icon-width: 28px;
        --iron-icon-height: 28px;
        transition: transform 250ms;
      }
      :host([new-mode]) #side-action-container iron-icon {
        transform: rotate(-45deg);
      }
      input {
        border-top: none;
        border-right: none;
        border-bottom: 1px solid var(--gin-grey-100);
        border-left: none;
        transition: 200ms border-color;
      }
      input:focus {
        outline: none;
        border-color: var(--gin-grey-200);
      }

      #close-icon {
        position: absolute;
        top: 16px;
        right: 24px;
        --iron-icon-width: 20px;
        --iron-icon-height: 20px;
      }

      gin-rule-editor {
        margin: 0 auto 40px;
      }

      #new-form {
        border: 1px dashed var(--gin-grey-100);
        color: var(--gin-grey-300);
        transition: border-color 250ms, color 250ms;
        margin: 0 auto 40px;
      }
      #new-form input {
        margin-right: 32px;
      }

      #rule-list {
        max-width: 680px;
        width: 100%;
        margin: 0 auto;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <div id="rule-list">
      <!-- Top bar -->
      <div id="top-bar" class="horizontal layout center-center l-relative">
        <div id="search-field"
             on-click="focusSearch"
             class="horizontal layout center-center"
             hidden$="[[_isArrayShort(rules.length)]]">
          <input type="text"
                 value="{{searchString::input}}"
                 placeholder$="[[localize('SEARCHXX')]]">
          <iron-icon icon="gin-icons:search"></iron-icon>
        </div>
        <div id="side-action-container"
             class="horizontal layout center-center"
             hidden$="[[_isArrayEmpty(rules.length)]]">
          <iron-icon icon="gin-icons:add" class="hoverable" on-click="toggleNewMode"></iron-icon>
        </div>
      </div>
      <!-- New form -->
      <div id="new-form" class="vertical layout center-center l-relative l-pv-4 l-ps-4" hidden$="[[!newMode]]">
        <iron-icon id="close-icon" class="hoverable" icon="gin-icons:close" on-click="toggleNewMode"></iron-icon>
        <div class="l-mb-4">
          <label for="new-gin-name" class="l-mr-2">[[localize('NEWTITLE')]]:</label>
          <input id="new-gin-name" type="text" size="35" on-keyup="onKeyup">
        </div>
        <div class="horizontal layout center-center">
          <button class="simple" on-click="addRule">
            <div>Ok</div>
          </button>
        </div>
      </div>
       <!-- Empty gins button -->
      <div id="empty-alert" hidden$="[[newMode]]">
        <div hidden$="[[!_isArrayEmpty(rules.length)]]" class="vertical layout center-center">
          <div class="l-mb-4">Üres a könyvtár.</div>
          <button id="empty-gins-button" 
                  class="simple l-m-auto l-mv-4"
                  on-click="toggleNewMode">
            <div class="horizontal layout center-center">
              <iron-icon icon="gin-icons:add"></iron-icon>
              <div>Új gin</div>
            </div>
          </button>
        </div>
      </div>
      <!-- Gins -->
      <template is="dom-repeat" id="repeater" items="{{rules}}" as="rule" index-as="ruleIndex" filter="[[_computeFilter(searchString)]]">
        <gin-rule-editor authors="{{rule.authors}}"
                         summarizers="{{rule.summarizers}}"
                         reports="{{rule.reports}}"
                         summaries="{{rule.summaries}}"
                         title="{{rule.title}}"
                         income-header="{{rule.incomeHeader}}"
                         on-delete-request="deleteGin" column-variables="[[_computeColumnVariables(rule, rule.columnVariables)]]"></gin-rule-editor>
      </template>
    </div>
`;
  }

  static get is() { return 'gin-rule-list'; }
  static get properties() {
    return {
      selected: {
        type: Number,
        value: 0
      },
      rules: {
        type: Array,
        value: () => [],
        notify: true
      },
      searchString: {
        type: String,
        value: null
      },
      newMode: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }
  constructor() {
    super();
  }
  static get observers() {
    return [
    ];
  }
  _computeFilter(searchString) {
    if (!searchString) {
      // set filter to null to disable filtering
      return null;
    } else {
      // return a filter function for the current search string
      searchString = searchString.toLowerCase();
      return function (item) {
        const regex = new RegExp(searchString, 'i');
        return regex.test(item.title);
      };
    }
  }
  _computeColumnVariables(rule, columnVariables) {
    return columnVariables || [];
  }
  focusSearch(e) {
    e.stopPropagation();
    this.shadowRoot.querySelector('input').focus();
  }
  deleteGin(e) {
    console.log(e.model)
    const cacheRules = this.rules;
    this.set('rules', []);
    // this.notifyPath('rules');
    requestAnimationFrame(() => {
      this.set('rules', cacheRules.filter((rule, index) => index !== e.model.ruleIndex));
      this.dispatchEvent(
        new CustomEvent('firebase-request', {
          bubbles: true,
          composed: true,
          detail: {
            type: 'delete-gin',
            docId: e.model.rule.id
          }
        })
      );
    });
  }
  toggleNewMode() {
    this.newMode = !this.newMode;
    if (this.newMode) {
      // put the cursor in the name input
      this.shadowRoot.querySelector('#new-gin-name').focus();
    } else {
      //empty the form
      this.shadowRoot.querySelector('#new-gin-name').value = '';
    }
  }
  onKeyup(e) {
    // on enter
    if (e.keyCode === 13) {
      this.addRule();
    }
  }
  addRule() {
    const newGin = {
      title: this.shadowRoot.querySelector('#new-form input').value || 'Új gin',
      authors: [],
      columnVariables: [],
      reports: [],
      summaries: []
    };
    // Workaround dom-repeat bug
    const newArray = this.rules.slice(0);
    this.set('rules', []);
    newArray.unshift(newGin);
    requestAnimationFrame(() => this.set('rules', newArray));
    this.dispatchEvent(
      new CustomEvent('firebase-request', {
        bubbles: true,
        composed: true,
        detail: {
          type: 'create-gin',
          gin: newGin
        }
      })
    );
    this.closeNewForm();
  }
  closeNewForm() {
    this.newMode = false;
    this.shadowRoot.querySelector('#new-form input').value = null;
  }
  _isArrayEmpty(length) {
    return length === 0;
  }
  _isArrayShort(length) {
    return length < 4;
  }
}
customElements.define(ginRuleList.is, ginRuleList);
