!function (e) {
    var t = {};

    function n(r) {
        if(t[r]) {
            return t[r].exports;
        }
        var o = t[r] = {i: r, l: !1, exports: {}};
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }

    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r})
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, n.t = function (e, t) {
        if(1 & t && (e = n(e)), 8 & t) {
            return e;
        }
        if(4 & t && "object" == typeof e && e && e.__esModule) {
            return e;
        }
        var r = Object.create(null);
        if(n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) {
            for (var o in e) {
                n.d(r, o, function (t) {
                    return e[t]
                }.bind(null, o));
            }
        }
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 4)
}([function (e, t, n) {
    "use strict";
    (function (e, r) {
        n.d(t, "b", (function () {
            return i
        })), n.d(t, "a", (function () {
            return u
        }));
        let o = null;

        function i(e) {
            o = e
        }

        function a(e) {
            o && o.debugLog && o.debugLog(e)
        }

        async function s() {
            const e = Date.now();
            let t;
            if(o && o.loadModule) {
                t = await o.loadModule;
            } else {
                const e = fetch(o && o.binaryURL || "/eversdk.wasm");
                if(WebAssembly.compileStreaming) {
                    return a("compileStreaming binary"), await WebAssembly.compileStreaming(e);
                }
                a("compile binary"), t = await WebAssembly.compile(await (await e).arrayBuffer())
            }
            await init(t), a("compile time " + (Date.now() - e))
        }

        function c() {
            let t;
            const n = new TextDecoder("utf-8", {ignoreBOM: !0, fatal: !0});
            n.decode();
            let o = new Uint8Array;

            function i() {
                return 0 === o.byteLength && (o = new Uint8Array(t.memory.buffer)), o
            }

            function a(e, t) {
                return n.decode(i().subarray(e, e + t))
            }

            const c = new Array(32).fill(void 0);
            c.push(void 0, null, !0, !1);
            let u = c.length;

            function _(e) {
                u === c.length && c.push(c.length + 1);
                const t = u;
                return u = c[t], c[t] = e, t
            }

            function g(e) {
                return c[e]
            }

            function d(e) {
                const t = g(e);
                return function (e) {
                    e < 36 || (c[e] = u, u = e)
                }(e), t
            }

            let l = 0;
            const f = new TextEncoder("utf-8"), b = "function" == typeof f.encodeInto ? function (e, t) {
                return f.encodeInto(e, t)
            } : function (e, t) {
                const n = f.encode(e);
                return t.set(n), {read: e.length, written: n.length}
            };

            function p(e, t, n) {
                if(void 0 === n) {
                    const n = f.encode(e), r = t(n.length);
                    return i().subarray(r, r + n.length).set(n), l = n.length, r
                }
                let r = e.length, o = t(r);
                const a = i();
                let s = 0;
                for (; s < r; s++) {
                    const t = e.charCodeAt(s);
                    if(t > 127) {
                        break;
                    }
                    a[o + s] = t
                }
                if(s !== r) {
                    0 !== s && (e = e.slice(s)), o = n(o, r, r = s + 3 * e.length);
                    const t = i().subarray(o + s, o + r);
                    s += b(e, t).written
                }
                return l = s, o
            }

            function h(e) {
                return null == e
            }

            let w = new Int32Array;

            function m() {
                return 0 === w.byteLength && (w = new Int32Array(t.memory.buffer)), w
            }

            let y = new Float64Array;

            function v(e, n, r, o) {
                const i = {a: e, b: n, cnt: 1, dtor: r}, a = (...e) => {
                    i.cnt++;
                    try {
                        return o(i.a, i.b, ...e)
                    } finally {
                        0 == --i.cnt && (t.__wbindgen_export_2.get(i.dtor)(i.a, i.b), i.a = 0)
                    }
                };
                return a.original = i, a
            }

            function O(e, n, r) {
                t._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcd16895fc6b5cf4f(e, n, _(r))
            }

            function E(e, n) {
                t._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8fed1f9ec273ba86(e, n)
            }

            function S(e, n, r, o) {
                const i = {a: e, b: n, cnt: 1, dtor: r}, a = (...e) => {
                    i.cnt++;
                    const n = i.a;
                    i.a = 0;
                    try {
                        return o(n, i.b, ...e)
                    } finally {
                        0 == --i.cnt ? t.__wbindgen_export_2.get(i.dtor)(n, i.b) : i.a = n
                    }
                };
                return a.original = i, a
            }

            function A(e, n) {
                t._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h781257ac79d45508(e, n)
            }

            function x(e, n, r) {
                try {
                    const i = t.__wbindgen_add_to_stack_pointer(-16);
                    t._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbf930554c406ccec(i, e, n, _(r));
                    var o = m()[i / 4 + 0];
                    if(m()[i / 4 + 1]) {
                        throw d(o)
                    }
                } finally {
                    t.__wbindgen_add_to_stack_pointer(16)
                }
            }

            function j(e, n, r) {
                t._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hfa20d6bbcb7583de(e, n, _(r))
            }

            function C(e, n, r) {
                t._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h72335e4be0937136(e, n, _(r))
            }

            function I(e, n, r) {
                t._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h47fb5176fcd06540(e, n, _(r))
            }

            function B(e) {
                try {
                    const o = t.__wbindgen_add_to_stack_pointer(-16),
                        i = p(e, t.__wbindgen_malloc, t.__wbindgen_realloc), s = l;
                    t.core_create_context(o, i, s);
                    var n = m()[o / 4 + 0], r = m()[o / 4 + 1];
                    return a(n, r)
                } finally {
                    t.__wbindgen_add_to_stack_pointer(16), t.__wbindgen_free(n, r)
                }
            }

            function R(e, n) {
                try {
                    return e.apply(this, n)
                } catch (e) {
                    t.__wbindgen_exn_store(_(e))
                }
            }

            function k(e, t) {
                return i().subarray(e / 1, e / 1 + t)
            }

            const q = new Uint32Array(2), M = new BigUint64Array(q.buffer), F = new BigInt64Array(q.buffer);

            function T() {
                const n = {wbg: {}};
                return n.wbg.__wbg_new_3ee7ebe9952c1fbd = function (e, t) {
                    return _(new Error(a(e, t)))
                }, n.wbg.__wbindgen_string_new = function (e, t) {
                    return _(a(e, t))
                }, n.wbg.__wbindgen_memory = function () {
                    return _(t.memory)
                }, n.wbg.__wbg_buffer_34f5ec9f8a838ba0 = function (e) {
                    return _(g(e).buffer)
                }, n.wbg.__wbg_newwithbyteoffsetandlength_88fdad741db1b182 = function (e, t, n) {
                    return _(new Uint8Array(g(e), t >>> 0, n >>> 0))
                }, n.wbg.__wbindgen_object_drop_ref = function (e) {
                    d(e)
                }, n.wbg.__wbg_newwithlength_df0e16f0b90b6295 = function (e) {
                    return _(new Array(e >>> 0))
                }, n.wbg.__wbg_set_64cc39858b2ec3f1 = function (e, t, n) {
                    g(e)[t >>> 0] = d(n)
                }, n.wbg.__wbg_newwithu8arraysequence_723043582a20ffe9 = function () {
                    return R((function (e) {
                        return _(new Blob(g(e)))
                    }), arguments)
                }, n.wbg.__wbg_get_72332cd2bc57924c = function () {
                    return R((function (e, t) {
                        return _(Reflect.get(g(e), g(t)))
                    }), arguments)
                }, n.wbg.__wbg_instanceof_ArrayBuffer_02bbeeb60438c785 = function (e) {
                    return g(e) instanceof ArrayBuffer
                }, n.wbg.__wbindgen_is_object = function (e) {
                    const t = g(e);
                    return "object" == typeof t && null !== t
                }, n.wbg.__wbg_new_cda198d9dbc6d7ea = function (e) {
                    return _(new Uint8Array(g(e)))
                }, n.wbg.__wbindgen_object_clone_ref = function (e) {
                    return _(g(e))
                }, n.wbg.__wbg_keys_71a760ca987f8933 = function (e) {
                    return _(Object.keys(g(e)))
                }, n.wbg.__wbg_length_a73bfd4c96dd97ef = function (e) {
                    return g(e).length
                }, n.wbg.__wbg_get_ad41fee29b7e0f53 = function (e, t) {
                    return _(g(e)[t >>> 0])
                }, n.wbg.__wbindgen_string_get = function (e, n) {
                    const r = g(n), o = "string" == typeof r ? r : void 0;
                    var i = h(o) ? 0 : p(o, t.__wbindgen_malloc, t.__wbindgen_realloc), a = l;
                    m()[e / 4 + 1] = a, m()[e / 4 + 0] = i
                }, n.wbg.__wbg_new0_adda2d4bcb124f0a = function () {
                    return _(new Date)
                }, n.wbg.__wbg_getTime_58b0bdbebd4ef11d = function (e) {
                    return g(e).getTime()
                }, n.wbg.__wbindgen_boolean_get = function (e) {
                    const t = g(e);
                    return "boolean" == typeof t ? t ? 1 : 0 : 2
                }, n.wbg.__wbindgen_is_bigint = function (e) {
                    return "bigint" == typeof g(e)
                }, n.wbg.__wbg_BigInt_4365947136b5327c = function (e, t) {
                    const n = BigInt(g(t));
                    F[0] = n;
                    const r = q[0], o = q[1];
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                }, n.wbg.__wbg_BigInt_73b2c10d8e6eb5a5 = function (e, t) {
                    q[0] = e, q[1] = t;
                    const n = F[0];
                    return _(BigInt(n))
                }, n.wbg.__wbg_is_43eb2f9708e964a9 = function (e, t) {
                    return Object.is(g(e), g(t))
                }, n.wbg.__wbindgen_number_get = function (e, n) {
                    const r = g(n), o = "number" == typeof r ? r : void 0;
                    (0 === y.byteLength && (y = new Float64Array(t.memory.buffer)), y)[e / 8 + 1] = h(o) ? 0 : o, m()[e / 4 + 0] = !h(o)
                }, n.wbg.__wbg_isSafeInteger_f6dd91807e9c4d35 = function (e) {
                    return Number.isSafeInteger(g(e))
                }, n.wbg.__wbg_isArray_a1a8c3a8ac24bdf1 = function (e) {
                    return Array.isArray(g(e))
                }, n.wbg.__wbg_iterator_22ed2b976832ff0c = function () {
                    return _(Symbol.iterator)
                }, n.wbg.__wbg_BigInt_6b6f34a01a71ad51 = function (e, t) {
                    const n = BigInt(g(t));
                    M[0] = n;
                    const r = q[0], o = q[1];
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                }, n.wbg.__wbg_BigInt_1a499fbb5f402f4c = function (e, t) {
                    q[0] = e, q[1] = t;
                    const n = M[0];
                    return _(BigInt(n))
                }, n.wbg.__wbg_entries_44c418612784cc9b = function (e) {
                    return _(Object.entries(g(e)))
                }, n.wbg.__wbg_new_ee1a3da85465d621 = function () {
                    return _(new Array)
                }, n.wbg.__wbindgen_number_new = function (e) {
                    return _(e)
                }, n.wbg.__wbg_new_ac586205e4424583 = function () {
                    return _(new Map)
                }, n.wbg.__wbg_new_e6a9fecc2bf26696 = function () {
                    return _(new Object)
                }, n.wbg.__wbg_set_a55cff623a9eaa21 = function (e, t, n) {
                    return _(g(e).set(g(t), g(n)))
                }, n.wbg.__wbindgen_is_string = function (e) {
                    return "string" == typeof g(e)
                }, n.wbg.__wbg_set_99349c55f95f84f7 = function (e, t, n) {
                    g(e)[d(t)] = d(n)
                }, n.wbg.__wbindgen_is_undefined = function (e) {
                    return void 0 === g(e)
                }, n.wbg.__wbindgen_is_null = function (e) {
                    return null === g(e)
                }, n.wbg.__wbg_String_7462bcc0fcdbaf7d = function (e, n) {
                    const r = p(String(g(n)), t.__wbindgen_malloc, t.__wbindgen_realloc), o = l;
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                }, n.wbg.__wbg_String_b36f151aad46550f = function (e, n) {
                    const r = p(String(g(n)), t.__wbindgen_malloc, t.__wbindgen_realloc), o = l;
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                }, n.wbg.__wbg_coreresponsehandler_5efd3f86b2df796e = function (e, t, n, r) {
                    var o, i, a, s;
                    o = e >>> 0, i = d(t), a = n >>> 0, s = 0 !== r, H && H(o, i, a, s)
                }, n.wbg.__wbg_message_924b46658b69b295 = function (e) {
                    return _(g(e).message)
                }, n.wbg.__wbg_process_e56fd54cf6319b6c = function (e) {
                    return _(g(e).process)
                }, n.wbg.__wbg_versions_77e21455908dad33 = function (e) {
                    return _(g(e).versions)
                }, n.wbg.__wbg_node_0dd25d832e4785d5 = function (e) {
                    return _(g(e).node)
                }, n.wbg.__wbg_static_accessor_NODE_MODULE_26b231378c1be7dd = function () {
                    return _(e)
                }, n.wbg.__wbg_require_0db1598d9ccecb30 = function () {
                    return R((function (e, t, n) {
                        return _(g(e).require(a(t, n)))
                    }), arguments)
                }, n.wbg.__wbg_crypto_b95d7173266618a9 = function (e) {
                    return _(g(e).crypto)
                }, n.wbg.__wbg_msCrypto_5a86d77a66230f81 = function (e) {
                    return _(g(e).msCrypto)
                }, n.wbg.__wbg_newwithlength_66e5530e7079ea1b = function (e) {
                    return _(new Uint8Array(e >>> 0))
                }, n.wbg.__wbg_transaction_19522f7b267f7a36 = function () {
                    return R((function (e, t, n, r) {
                        return _(g(e).transaction(a(t, n), d(r)))
                    }), arguments)
                }, n.wbg.__wbg_setoncomplete_8bfbade4ed628fd0 = function (e, t) {
                    g(e).oncomplete = g(t)
                }, n.wbg.__wbg_setonerror_9d842115702fd223 = function (e, t) {
                    g(e).onerror = g(t)
                }, n.wbg.__wbg_setonabort_69c07f28ddb8cf94 = function (e, t) {
                    g(e).onabort = g(t)
                }, n.wbg.__wbg_item_b803f05190a1dbc8 = function (e, n, r) {
                    const o = g(n).item(r >>> 0);
                    var i = h(o) ? 0 : p(o, t.__wbindgen_malloc, t.__wbindgen_realloc), a = l;
                    m()[e / 4 + 1] = a, m()[e / 4 + 0] = i
                }, n.wbg.__wbg_objectStore_76c268be095ec9a5 = function () {
                    return R((function (e, t, n) {
                        return _(g(e).objectStore(a(t, n)))
                    }), arguments)
                }, n.wbg.__wbg_target_68a5c10e2732a79e = function (e) {
                    const t = g(e).target;
                    return h(t) ? 0 : _(t)
                }, n.wbg.__wbg_readyState_e0d700ad5333a563 = function (e) {
                    return _(g(e).readyState)
                }, n.wbg.__wbg_setonsuccess_bb91afe1f8110021 = function (e, t) {
                    g(e).onsuccess = g(t)
                }, n.wbg.__wbg_setonerror_db491b84dd45e918 = function (e, t) {
                    g(e).onerror = g(t)
                }, n.wbg.__wbindgen_cb_drop = function (e) {
                    const t = d(e).original;
                    if(1 == t.cnt--) {
                        return t.a = 0, !0;
                    }
                    return !1
                }, n.wbg.__wbg_next_3d0c4cc33e7418c9 = function () {
                    return R((function (e) {
                        return _(g(e).next())
                    }), arguments)
                }, n.wbg.__wbg_done_e5655b169bb04f60 = function (e) {
                    return g(e).done
                }, n.wbg.__wbg_value_8f901bca1014f843 = function (e) {
                    return _(g(e).value)
                }, n.wbg.__wbindgen_is_function = function (e) {
                    return "function" == typeof g(e)
                }, n.wbg.__wbg_call_33d7bcddbbfa394a = function () {
                    return R((function (e, t) {
                        return _(g(e).call(g(t)))
                    }), arguments)
                }, n.wbg.__wbg_next_726d1c2255989269 = function (e) {
                    return _(g(e).next)
                }, n.wbg.__wbg_self_fd00a1ef86d1b2ed = function () {
                    return R((function () {
                        return _(self.self)
                    }), arguments)
                }, n.wbg.__wbg_window_6f6e346d8bbd61d7 = function () {
                    return R((function () {
                        return _(window.window)
                    }), arguments)
                }, n.wbg.__wbg_globalThis_3348936ac49df00a = function () {
                    return R((function () {
                        return _(globalThis.globalThis)
                    }), arguments)
                }, n.wbg.__wbg_global_67175caf56f55ca9 = function () {
                    return R((function () {
                        return _(r.global)
                    }), arguments)
                }, n.wbg.__wbg_newnoargs_971e9a5abe185139 = function (e, t) {
                    return _(new Function(a(e, t)))
                }, n.wbg.__wbg_set_1a930cfcda1a8067 = function (e, t, n) {
                    g(e).set(g(t), n >>> 0)
                }, n.wbg.__wbg_length_51f19f73d6d9eff3 = function (e) {
                    return g(e).length
                }, n.wbg.__wbg_has_3be27932089d278e = function () {
                    return R((function (e, t) {
                        return Reflect.has(g(e), g(t))
                    }), arguments)
                }, n.wbg.__wbg_set_2762e698c2f5b7e0 = function () {
                    return R((function (e, t, n) {
                        return Reflect.set(g(e), g(t), g(n))
                    }), arguments)
                }, n.wbg.__wbg_randomFillSync_91e2b39becca6147 = function () {
                    return R((function (e, t, n) {
                        g(e).randomFillSync(k(t, n))
                    }), arguments)
                }, n.wbg.__wbg_subarray_270ff8dd5582c1ac = function (e, t, n) {
                    return _(g(e).subarray(t >>> 0, n >>> 0))
                }, n.wbg.__wbg_getRandomValues_b14734aa289bc356 = function () {
                    return R((function (e, t) {
                        g(e).getRandomValues(g(t))
                    }), arguments)
                }, n.wbg.__wbg_self_86b4b13392c7af56 = function () {
                    return R((function () {
                        return _(self.self)
                    }), arguments)
                }, n.wbg.__wbg_crypto_b8c92eaac23d0d80 = function (e) {
                    return _(g(e).crypto)
                }, n.wbg.__wbg_msCrypto_9ad6677321a08dd8 = function (e) {
                    return _(g(e).msCrypto)
                }, n.wbg.__wbg_static_accessor_MODULE_452b4680e8614c81 = function () {
                    return _(e)
                }, n.wbg.__wbg_require_f5521a5b85ad2542 = function (e, t, n) {
                    return _(g(e).require(a(t, n)))
                }, n.wbg.__wbg_getRandomValues_dd27e6b0652b3236 = function (e) {
                    return _(g(e).getRandomValues)
                }, n.wbg.__wbg_randomFillSync_d2ba53160aec6aba = function (e, t, n) {
                    g(e).randomFillSync(k(t, n))
                }, n.wbg.__wbg_getRandomValues_e57c9b75ddead065 = function (e, t) {
                    g(e).getRandomValues(g(t))
                }, n.wbg.__wbg_instanceof_Uint8Array_36c37b9ca15e3e0a = function (e) {
                    return g(e) instanceof Uint8Array
                }, n.wbg.__wbg_put_e193e5c9c96e937f = function () {
                    return R((function (e, t, n) {
                        return _(g(e).put(g(t), g(n)))
                    }), arguments)
                }, n.wbg.__wbg_delete_1ca98818fdc40291 = function () {
                    return R((function (e, t) {
                        return _(g(e).delete(g(t)))
                    }), arguments)
                }, n.wbg.__wbg_setTimeout_b9c1670391a219b8 = function () {
                    return R((function (e, t, n) {
                        return g(e).setTimeout(g(t), n)
                    }), arguments)
                }, n.wbg.__wbg_clearTimeout_2b1d235f7a5ba907 = function (e, t) {
                    g(e).clearTimeout(t)
                }, n.wbg.__wbg_newwithstrandinit_de7c409ec8538105 = function () {
                    return R((function (e, t, n) {
                        return _(new Request(a(e, t), g(n)))
                    }), arguments)
                }, n.wbg.__wbg_headers_0aeca08d4e61e2e7 = function (e) {
                    return _(g(e).headers)
                }, n.wbg.__wbg_set_b5c36262f65fae92 = function () {
                    return R((function (e, t, n, r, o) {
                        g(e).set(a(t, n), a(r, o))
                    }), arguments)
                }, n.wbg.__wbg_fetch_9a5cb9d8a96004d0 = function (e, t) {
                    return _(g(e).fetch(g(t)))
                }, n.wbg.__wbg_instanceof_Response_240e67e5796c3c6b = function (e) {
                    return g(e) instanceof Response
                }, n.wbg.__wbg_status_9067c6a4fdd064c9 = function (e) {
                    return g(e).status
                },n.wbg.__wbg_url_0f503b904b694ff5 = function (e, n) {
                    const r = p(g(n).url, t.__wbindgen_malloc, t.__wbindgen_realloc), o = l;
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                },n.wbg.__wbg_setonversionchange_9061b53c8285029c = function (e, t) {
                    g(e).onversionchange = g(t)
                },n.wbg.__wbg_setonupgradeneeded_8956d6214819f478 = function (e, t) {
                    g(e).onupgradeneeded = g(t)
                },n.wbg.__wbg_setonblocked_99ef29b25a6726f0 = function (e, t) {
                    g(e).onblocked = g(t)
                },n.wbg.__wbg_message_07e9066c9045403b = function (e, n) {
                    const r = p(g(n).message, t.__wbindgen_malloc, t.__wbindgen_realloc), o = l;
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                },n.wbg.__wbg_stringify_d8d1ee75d5b55ce4 = function () {
                    return R((function (e) {
                        return _(JSON.stringify(g(e)))
                    }), arguments)
                },n.wbg.__wbg_Window_e2d90a08fe8bf335 = function (e) {
                    return _(g(e).Window)
                },n.wbg.__wbg_WorkerGlobalScope_e36777b81ac97fe3 = function (e) {
                    return _(g(e).WorkerGlobalScope)
                },n.wbg.__wbg_indexedDB_25d12ace6cb91d5a = function () {
                    return R((function (e) {
                        const t = g(e).indexedDB;
                        return h(t) ? 0 : _(t)
                    }), arguments)
                },n.wbg.__wbg_indexedDB_6df068f0d15cbbfe = function () {
                    return R((function (e) {
                        const t = g(e).indexedDB;
                        return h(t) ? 0 : _(t)
                    }), arguments)
                },n.wbg.__wbg_open_2a1e9120d3d8897d = function () {
                    return R((function (e, t, n) {
                        return _(g(e).open(a(t, n)))
                    }), arguments)
                },n.wbg.__wbg_send_56ace0158235d307 = function () {
                    return R((function (e, t, n) {
                        g(e).send(a(t, n))
                    }), arguments)
                },n.wbg.__wbg_data_63829cccb08a0246 = function (e) {
                    return _(g(e).data)
                },n.wbg.__wbg_newwithstr_3e7cf2650b0b22a7 = function () {
                    return R((function (e, t, n, r) {
                        return _(new WebSocket(a(e, t), a(n, r)))
                    }), arguments)
                },n.wbg.__wbg_new_875d595b7582236e = function () {
                    return R((function (e, t) {
                        return _(new WebSocket(a(e, t)))
                    }), arguments)
                },n.wbg.__wbg_setonmessage_7ff15f986bd94ef0 = function (e, t) {
                    g(e).onmessage = g(t)
                },n.wbg.__wbg_setonopen_e58b724aa21610a4 = function (e, t) {
                    g(e).onopen = g(t)
                },n.wbg.__wbg_setonerror_3375cf6162c60ad1 = function (e, t) {
                    g(e).onerror = g(t)
                },n.wbg.__wbg_objectStoreNames_d11a3d06e3226638 = function (e) {
                    return _(g(e).objectStoreNames)
                },n.wbg.__wbg_createObjectStore_84b6922280a33472 = function () {
                    return R((function (e, t, n) {
                        return _(g(e).createObjectStore(a(t, n)))
                    }), arguments)
                },n.wbg.__wbg_instanceof_Error_2082612c1902c887 = function (e) {
                    return g(e) instanceof Error
                },n.wbg.__wbg_getTimezoneOffset_8a39b51acb4f52c9 = function (e) {
                    return g(e).getTimezoneOffset()
                },n.wbg.__wbindgen_debug_string = function (e, n) {
                    const r = p(function e(t) {
                        const n = typeof t;
                        if("number" == n || "boolean" == n || null == t) {
                            return "" + t;
                        }
                        if("string" == n) {
                            return `"${t}"`;
                        }
                        if("symbol" == n) {
                            const e = t.description;
                            return null == e ? "Symbol" : `Symbol(${e})`
                        }
                        if("function" == n) {
                            const e = t.name;
                            return "string" == typeof e && e.length > 0 ? `Function(${e})` : "Function"
                        }
                        if(Array.isArray(t)) {
                            const n = t.length;
                            let r = "[";
                            n > 0 && (r += e(t[0]));
                            for (let o = 1; o < n; o++) {
                                r += ", " + e(t[o]);
                            }
                            return r += "]", r
                        }
                        const r = /\[object ([^\]]+)\]/.exec(toString.call(t));
                        let o;
                        if(!(r.length > 1)) {
                            return toString.call(t);
                        }
                        if(o = r[1], "Object" == o) {
                            try {
                                return "Object(" + JSON.stringify(t) + ")"
                            } catch (e) {
                                return "Object"
                            }
                        }
                        return t instanceof Error ? `${t.name}: ${t.message}\n${t.stack}` : o
                    }(g(n)), t.__wbindgen_malloc, t.__wbindgen_realloc), o = l;
                    m()[e / 4 + 1] = o, m()[e / 4 + 0] = r
                },n.wbg.__wbindgen_throw = function (e, t) {
                    throw new Error(a(e, t))
                },n.wbg.__wbg_then_e5489f796341454b = function (e, t, n) {
                    return _(g(e).then(g(t), g(n)))
                },n.wbg.__wbg_resolve_0107b3a501450ba0 = function (e) {
                    return _(Promise.resolve(g(e)))
                },n.wbg.__wbg_then_18da6e5453572fc8 = function (e, t) {
                    return _(g(e).then(g(t)))
                },n.wbg.__wbg_result_4b44b0d900b4ab6f = function () {
                    return R((function (e) {
                        return _(g(e).result)
                    }), arguments)
                },n.wbg.__wbg_error_c872d3f7251736f1 = function () {
                    return R((function (e) {
                        const t = g(e).error;
                        return h(t) ? 0 : _(t)
                    }), arguments)
                },n.wbg.__wbg_get_28f9ffc7eb5802f3 = function () {
                    return R((function (e, t) {
                        return _(g(e).get(g(t)))
                    }), arguments)
                },n.wbg.__wbg_instanceof_Window_42f092928baaee84 = function (e) {
                    return !0
                },n.wbg.__wbg_close_23fa900ecee13ee4 = function () {
                    return R((function (e) {
                        g(e).close()
                    }), arguments)
                },n.wbg.__wbg_text_64ed39439c06af3f = function () {
                    return R((function (e) {
                        return _(g(e).text())
                    }), arguments)
                },n.wbg.__wbindgen_closure_wrapper908 = function (e, t, n) {
                    return _(v(e, t, 46, O))
                },n.wbg.__wbindgen_closure_wrapper920 = function (e, t, n) {
                    return _(v(e, t, 43, E))
                },n.wbg.__wbindgen_closure_wrapper6293 = function (e, t, n) {
                    return _(S(e, t, 234, A))
                },n.wbg.__wbindgen_closure_wrapper6993 = function (e, t, n) {
                    return _(S(e, t, 243, x))
                },n.wbg.__wbindgen_closure_wrapper7292 = function (e, t, n) {
                    return _(S(e, t, 240, j))
                },n.wbg.__wbindgen_closure_wrapper7293 = function (e, t, n) {
                    return _(S(e, t, 1187, C))
                },n.wbg.__wbindgen_closure_wrapper7294 = function (e, t, n) {
                    return _(S(e, t, 237, I))
                },n
            }

            function P(e, n) {
                return t = e.exports, N.__wbindgen_wasm_module = n, y = new Float64Array, w = new Int32Array, o = new Uint8Array, t
            }

            async function N(e) {
                const t = T();
                ("string" == typeof e || "function" == typeof Request && e instanceof Request || "function" == typeof URL && e instanceof URL) && (e = fetch(e));
                const {instance: n, module: r} = await async function (e, t) {
                    if("function" == typeof Response && e instanceof Response) {
                        if("function" == typeof WebAssembly.instantiateStreaming) {
                            try {
                                return await WebAssembly.instantiateStreaming(e, t)
                            } catch (t) {
                                if("application/wasm" == e.headers.get("Content-Type")) {
                                    throw t;
                                }
                                console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", t)
                            }
                        }
                        const n = await e.arrayBuffer();
                        return await WebAssembly.instantiate(n, t)
                    }
                    {
                        const n = await WebAssembly.instantiate(e, t);
                        return n instanceof WebAssembly.Instance ? {instance: n, module: e} : n
                    }
                }(await e, t);
                return P(n, r)
            }

            let D = [], H = null;
            return (async () => {
                await N(await s());
                for (const e of D) {
                    e.resolve(B(e.configJson));
                }
                D = null
            })(), Promise.resolve({
                setResponseParamsHandler: e => {
                    H = e
                }, createContext: e => null === D ? Promise.resolve(B(e)) : new Promise(t => {
                    D.push({configJson: e, resolve: t})
                }), destroyContext: e => {
                    !function (e) {
                        t.core_destroy_context(e)
                    }(e)
                }, sendRequestParams: (e, n, r, o) => {
                    (async () => {
                        !function (e, n, r, o) {
                            try {
                                const a = t.__wbindgen_add_to_stack_pointer(-16),
                                    s = p(n, t.__wbindgen_malloc, t.__wbindgen_realloc), c = l;
                                t.core_request(a, e, s, c, _(r), o);
                                var i = m()[a / 4 + 0];
                                if(m()[a / 4 + 1]) {
                                    throw d(i)
                                }
                            } finally {
                                t.__wbindgen_add_to_stack_pointer(16)
                            }
                        }(e, r, await async function e(t) {
                            if(t instanceof Blob) {
                                return await t.arrayBuffer();
                            }
                            if("bigint" == typeof t) {
                                return t < Number.MAX_SAFE_INTEGER && t > Number.MIN_SAFE_INTEGER ? Number(t) : t.toString();
                            }
                            if("object" == typeof t && null !== t) {
                                const n = Array.isArray(t) ? [] : {};
                                for (const r in t) {
                                    n[r] = await e(t[r]);
                                }
                                return n
                            }
                            return t
                        }(o), n)
                    })()
                }
            })
        }

        function u() {
            return o && o.disableSeparateWorker ? c() : function () {
                const e = new Blob(["//****************************************************************** WRAPPER BEGIN\n\nlet wasm;\n\nconst cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachedUint8Memory0 = new Uint8Array();\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nconst heap = new Array(32).fill(undefined);\n\nheap.push(undefined, null, true, false);\n\nlet heap_next = heap.length;\n\nfunction addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n\n    heap[idx] = obj;\n    return idx;\n}\n\nfunction getObject(idx) { return heap[idx]; }\n\nfunction dropObject(idx) {\n    if (idx < 36) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n}\n\nfunction takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst cachedTextEncoder = new TextEncoder('utf-8');\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length);\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len);\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3);\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n\n        offset += ret.written;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n\nfunction isLikeNone(x) {\n    return x === undefined || x === null;\n}\n\nlet cachedInt32Memory0 = new Int32Array();\n\nfunction getInt32Memory0() {\n    if (cachedInt32Memory0.byteLength === 0) {\n        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);\n    }\n    return cachedInt32Memory0;\n}\n\nlet cachedFloat64Memory0 = new Float64Array();\n\nfunction getFloat64Memory0() {\n    if (cachedFloat64Memory0.byteLength === 0) {\n        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);\n    }\n    return cachedFloat64Memory0;\n}\n\nfunction debugString(val) {\n    // primitive types\n    const type = typeof val;\n    if (type == 'number' || type == 'boolean' || val == null) {\n        return  `${val}`;\n    }\n    if (type == 'string') {\n        return `\"${val}\"`;\n    }\n    if (type == 'symbol') {\n        const description = val.description;\n        if (description == null) {\n            return 'Symbol';\n        } else {\n            return `Symbol(${description})`;\n        }\n    }\n    if (type == 'function') {\n        const name = val.name;\n        if (typeof name == 'string' && name.length > 0) {\n            return `Function(${name})`;\n        } else {\n            return 'Function';\n        }\n    }\n    // objects\n    if (Array.isArray(val)) {\n        const length = val.length;\n        let debug = '[';\n        if (length > 0) {\n            debug += debugString(val[0]);\n        }\n        for(let i = 1; i < length; i++) {\n            debug += ', ' + debugString(val[i]);\n        }\n        debug += ']';\n        return debug;\n    }\n    // Test for built-in\n    const builtInMatches = /\\[object ([^\\]]+)\\]/.exec(toString.call(val));\n    let className;\n    if (builtInMatches.length > 1) {\n        className = builtInMatches[1];\n    } else {\n        // Failed to match the standard '[object ClassName]'\n        return toString.call(val);\n    }\n    if (className == 'Object') {\n        // we're a user defined class or Object\n        // JSON.stringify avoids problems with cycles, and is generally much\n        // easier than looping through ownProperties of `val`.\n        try {\n            return 'Object(' + JSON.stringify(val) + ')';\n        } catch (_) {\n            return 'Object';\n        }\n    }\n    // errors\n    if (val instanceof Error) {\n        return `${val.name}: ${val.message}\\n${val.stack}`;\n    }\n    // TODO we could test for more things here, like `Set`s and `Map`s.\n    return className;\n}\n\nfunction makeClosure(arg0, arg1, dtor, f) {\n    const state = { a: arg0, b: arg1, cnt: 1, dtor };\n    const real = (...args) => {\n        // First up with a closure we increment the internal reference\n        // count. This ensures that the Rust closure environment won't\n        // be deallocated while we're invoking it.\n        state.cnt++;\n        try {\n            return f(state.a, state.b, ...args);\n        } finally {\n            if (--state.cnt === 0) {\n                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);\n                state.a = 0;\n\n            }\n        }\n    };\n    real.original = state;\n\n    return real;\n}\nfunction __wbg_adapter_36(arg0, arg1, arg2) {\n    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcd16895fc6b5cf4f(arg0, arg1, addHeapObject(arg2));\n}\n\nfunction __wbg_adapter_39(arg0, arg1) {\n    wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8fed1f9ec273ba86(arg0, arg1);\n}\n\nfunction makeMutClosure(arg0, arg1, dtor, f) {\n    const state = { a: arg0, b: arg1, cnt: 1, dtor };\n    const real = (...args) => {\n        // First up with a closure we increment the internal reference\n        // count. This ensures that the Rust closure environment won't\n        // be deallocated while we're invoking it.\n        state.cnt++;\n        const a = state.a;\n        state.a = 0;\n        try {\n            return f(a, state.b, ...args);\n        } finally {\n            if (--state.cnt === 0) {\n                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);\n\n            } else {\n                state.a = a;\n            }\n        }\n    };\n    real.original = state;\n\n    return real;\n}\nfunction __wbg_adapter_42(arg0, arg1) {\n    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h781257ac79d45508(arg0, arg1);\n}\n\nfunction __wbg_adapter_45(arg0, arg1, arg2) {\n    try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbf930554c406ccec(retptr, arg0, arg1, addHeapObject(arg2));\n        var r0 = getInt32Memory0()[retptr / 4 + 0];\n        var r1 = getInt32Memory0()[retptr / 4 + 1];\n        if (r1) {\n            throw takeObject(r0);\n        }\n    } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n    }\n}\n\nfunction __wbg_adapter_48(arg0, arg1, arg2) {\n    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hfa20d6bbcb7583de(arg0, arg1, addHeapObject(arg2));\n}\n\nfunction __wbg_adapter_51(arg0, arg1, arg2) {\n    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h72335e4be0937136(arg0, arg1, addHeapObject(arg2));\n}\n\nfunction __wbg_adapter_54(arg0, arg1, arg2) {\n    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h47fb5176fcd06540(arg0, arg1, addHeapObject(arg2));\n}\n\n/**\n* @param {string} config_json\n* @returns {string}\n*/\nfunction core_create_context(config_json) {\n    try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(config_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.core_create_context(retptr, ptr0, len0);\n        var r0 = getInt32Memory0()[retptr / 4 + 0];\n        var r1 = getInt32Memory0()[retptr / 4 + 1];\n        return getStringFromWasm0(r0, r1);\n    } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n        wasm.__wbindgen_free(r0, r1);\n    }\n}\n\n/**\n* @param {number} context\n*/\nfunction core_destroy_context(context) {\n    wasm.core_destroy_context(context);\n}\n\n/**\n* @param {number} context\n* @param {string} function_name\n* @param {any} params\n* @param {number} request_id\n*/\nfunction core_request(context, function_name, params, request_id) {\n    try {\n        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);\n        const ptr0 = passStringToWasm0(function_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        wasm.core_request(retptr, context, ptr0, len0, addHeapObject(params), request_id);\n        var r0 = getInt32Memory0()[retptr / 4 + 0];\n        var r1 = getInt32Memory0()[retptr / 4 + 1];\n        if (r1) {\n            throw takeObject(r0);\n        }\n    } finally {\n        wasm.__wbindgen_add_to_stack_pointer(16);\n    }\n}\n\nfunction handleError(f, args) {\n    try {\n        return f.apply(this, args);\n    } catch (e) {\n        wasm.__wbindgen_exn_store(addHeapObject(e));\n    }\n}\n\nfunction getArrayU8FromWasm0(ptr, len) {\n    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);\n}\n\nconst u32CvtShim = new Uint32Array(2);\n\nconst uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);\n\nconst int64CvtShim = new BigInt64Array(u32CvtShim.buffer);\n\nasync function load(module, imports) {\n    if (typeof Response === 'function' && module instanceof Response) {\n        if (typeof WebAssembly.instantiateStreaming === 'function') {\n            try {\n                return await WebAssembly.instantiateStreaming(module, imports);\n\n            } catch (e) {\n                if (module.headers.get('Content-Type') != 'application/wasm') {\n                    console.warn(\"`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n\", e);\n\n                } else {\n                    throw e;\n                }\n            }\n        }\n\n        const bytes = await module.arrayBuffer();\n        return await WebAssembly.instantiate(bytes, imports);\n\n    } else {\n        const instance = await WebAssembly.instantiate(module, imports);\n\n        if (instance instanceof WebAssembly.Instance) {\n            return { instance, module };\n\n        } else {\n            return instance;\n        }\n    }\n}\n\nfunction getImports() {\n    const imports = {};\n    imports.wbg = {};\n    imports.wbg.__wbg_new_3ee7ebe9952c1fbd = function(arg0, arg1) {\n        const ret = new Error(getStringFromWasm0(arg0, arg1));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {\n        const ret = getStringFromWasm0(arg0, arg1);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_memory = function() {\n        const ret = wasm.memory;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_buffer_34f5ec9f8a838ba0 = function(arg0) {\n        const ret = getObject(arg0).buffer;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_newwithbyteoffsetandlength_88fdad741db1b182 = function(arg0, arg1, arg2) {\n        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {\n        takeObject(arg0);\n    };\n    imports.wbg.__wbg_newwithlength_df0e16f0b90b6295 = function(arg0) {\n        const ret = new Array(arg0 >>> 0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_set_64cc39858b2ec3f1 = function(arg0, arg1, arg2) {\n        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);\n    };\n    imports.wbg.__wbg_newwithu8arraysequence_723043582a20ffe9 = function() { return handleError(function (arg0) {\n        const ret = new Blob(getObject(arg0));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_get_72332cd2bc57924c = function() { return handleError(function (arg0, arg1) {\n        const ret = Reflect.get(getObject(arg0), getObject(arg1));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_instanceof_ArrayBuffer_02bbeeb60438c785 = function(arg0) {\n        const ret = getObject(arg0) instanceof ArrayBuffer;\n        return ret;\n    };\n    imports.wbg.__wbindgen_is_object = function(arg0) {\n        const val = getObject(arg0);\n        const ret = typeof(val) === 'object' && val !== null;\n        return ret;\n    };\n    imports.wbg.__wbg_new_cda198d9dbc6d7ea = function(arg0) {\n        const ret = new Uint8Array(getObject(arg0));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {\n        const ret = getObject(arg0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_keys_71a760ca987f8933 = function(arg0) {\n        const ret = Object.keys(getObject(arg0));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_length_a73bfd4c96dd97ef = function(arg0) {\n        const ret = getObject(arg0).length;\n        return ret;\n    };\n    imports.wbg.__wbg_get_ad41fee29b7e0f53 = function(arg0, arg1) {\n        const ret = getObject(arg0)[arg1 >>> 0];\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {\n        const obj = getObject(arg1);\n        const ret = typeof(obj) === 'string' ? obj : undefined;\n        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        var len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_new0_adda2d4bcb124f0a = function() {\n        const ret = new Date();\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_getTime_58b0bdbebd4ef11d = function(arg0) {\n        const ret = getObject(arg0).getTime();\n        return ret;\n    };\n    imports.wbg.__wbindgen_boolean_get = function(arg0) {\n        const v = getObject(arg0);\n        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;\n        return ret;\n    };\n    imports.wbg.__wbindgen_is_bigint = function(arg0) {\n        const ret = typeof(getObject(arg0)) === 'bigint';\n        return ret;\n    };\n    imports.wbg.__wbg_BigInt_4365947136b5327c = function(arg0, arg1) {\n        const ret = BigInt(getObject(arg1));\n        int64CvtShim[0] = ret;\n        const low0 = u32CvtShim[0];\n        const high0 = u32CvtShim[1];\n        getInt32Memory0()[arg0 / 4 + 1] = high0;\n        getInt32Memory0()[arg0 / 4 + 0] = low0;\n    };\n    imports.wbg.__wbg_BigInt_73b2c10d8e6eb5a5 = function(arg0, arg1) {\n        u32CvtShim[0] = arg0;\n        u32CvtShim[1] = arg1;\n        const n0 = int64CvtShim[0];\n        const ret = BigInt(n0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_is_43eb2f9708e964a9 = function(arg0, arg1) {\n        const ret = Object.is(getObject(arg0), getObject(arg1));\n        return ret;\n    };\n    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {\n        const obj = getObject(arg1);\n        const ret = typeof(obj) === 'number' ? obj : undefined;\n        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;\n        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);\n    };\n    imports.wbg.__wbg_isSafeInteger_f6dd91807e9c4d35 = function(arg0) {\n        const ret = Number.isSafeInteger(getObject(arg0));\n        return ret;\n    };\n    imports.wbg.__wbg_isArray_a1a8c3a8ac24bdf1 = function(arg0) {\n        const ret = Array.isArray(getObject(arg0));\n        return ret;\n    };\n    imports.wbg.__wbg_iterator_22ed2b976832ff0c = function() {\n        const ret = Symbol.iterator;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_BigInt_6b6f34a01a71ad51 = function(arg0, arg1) {\n        const ret = BigInt(getObject(arg1));\n        uint64CvtShim[0] = ret;\n        const low0 = u32CvtShim[0];\n        const high0 = u32CvtShim[1];\n        getInt32Memory0()[arg0 / 4 + 1] = high0;\n        getInt32Memory0()[arg0 / 4 + 0] = low0;\n    };\n    imports.wbg.__wbg_BigInt_1a499fbb5f402f4c = function(arg0, arg1) {\n        u32CvtShim[0] = arg0;\n        u32CvtShim[1] = arg1;\n        const n0 = uint64CvtShim[0];\n        const ret = BigInt(n0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_entries_44c418612784cc9b = function(arg0) {\n        const ret = Object.entries(getObject(arg0));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_ee1a3da85465d621 = function() {\n        const ret = new Array();\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_number_new = function(arg0) {\n        const ret = arg0;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_ac586205e4424583 = function() {\n        const ret = new Map();\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_new_e6a9fecc2bf26696 = function() {\n        const ret = new Object();\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_set_a55cff623a9eaa21 = function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_is_string = function(arg0) {\n        const ret = typeof(getObject(arg0)) === 'string';\n        return ret;\n    };\n    imports.wbg.__wbg_set_99349c55f95f84f7 = function(arg0, arg1, arg2) {\n        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);\n    };\n    imports.wbg.__wbindgen_is_undefined = function(arg0) {\n        const ret = getObject(arg0) === undefined;\n        return ret;\n    };\n    imports.wbg.__wbindgen_is_null = function(arg0) {\n        const ret = getObject(arg0) === null;\n        return ret;\n    };\n    imports.wbg.__wbg_String_7462bcc0fcdbaf7d = function(arg0, arg1) {\n        const ret = String(getObject(arg1));\n        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_String_b36f151aad46550f = function(arg0, arg1) {\n        const ret = String(getObject(arg1));\n        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_coreresponsehandler_5efd3f86b2df796e = function(arg0, arg1, arg2, arg3) {\n        core_response_handler(arg0 >>> 0, takeObject(arg1), arg2 >>> 0, arg3 !== 0);\n    };\n    imports.wbg.__wbg_message_924b46658b69b295 = function(arg0) {\n        const ret = getObject(arg0).message;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_process_e56fd54cf6319b6c = function(arg0) {\n        const ret = getObject(arg0).process;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_versions_77e21455908dad33 = function(arg0) {\n        const ret = getObject(arg0).versions;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_node_0dd25d832e4785d5 = function(arg0) {\n        const ret = getObject(arg0).node;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_static_accessor_NODE_MODULE_26b231378c1be7dd = function() {\n        const ret = module;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_require_0db1598d9ccecb30 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_crypto_b95d7173266618a9 = function(arg0) {\n        const ret = getObject(arg0).crypto;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_msCrypto_5a86d77a66230f81 = function(arg0) {\n        const ret = getObject(arg0).msCrypto;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_newwithlength_66e5530e7079ea1b = function(arg0) {\n        const ret = new Uint8Array(arg0 >>> 0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_transaction_19522f7b267f7a36 = function() { return handleError(function (arg0, arg1, arg2, arg3) {\n        const ret = getObject(arg0).transaction(getStringFromWasm0(arg1, arg2), takeObject(arg3));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_setoncomplete_8bfbade4ed628fd0 = function(arg0, arg1) {\n        getObject(arg0).oncomplete = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonerror_9d842115702fd223 = function(arg0, arg1) {\n        getObject(arg0).onerror = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonabort_69c07f28ddb8cf94 = function(arg0, arg1) {\n        getObject(arg0).onabort = getObject(arg1);\n    };\n    imports.wbg.__wbg_item_b803f05190a1dbc8 = function(arg0, arg1, arg2) {\n        const ret = getObject(arg1).item(arg2 >>> 0);\n        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        var len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_objectStore_76c268be095ec9a5 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_target_68a5c10e2732a79e = function(arg0) {\n        const ret = getObject(arg0).target;\n        return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    };\n    imports.wbg.__wbg_readyState_e0d700ad5333a563 = function(arg0) {\n        const ret = getObject(arg0).readyState;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_setonsuccess_bb91afe1f8110021 = function(arg0, arg1) {\n        getObject(arg0).onsuccess = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonerror_db491b84dd45e918 = function(arg0, arg1) {\n        getObject(arg0).onerror = getObject(arg1);\n    };\n    imports.wbg.__wbindgen_cb_drop = function(arg0) {\n        const obj = takeObject(arg0).original;\n        if (obj.cnt-- == 1) {\n            obj.a = 0;\n            return true;\n        }\n        const ret = false;\n        return ret;\n    };\n    imports.wbg.__wbg_next_3d0c4cc33e7418c9 = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).next();\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_done_e5655b169bb04f60 = function(arg0) {\n        const ret = getObject(arg0).done;\n        return ret;\n    };\n    imports.wbg.__wbg_value_8f901bca1014f843 = function(arg0) {\n        const ret = getObject(arg0).value;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_is_function = function(arg0) {\n        const ret = typeof(getObject(arg0)) === 'function';\n        return ret;\n    };\n    imports.wbg.__wbg_call_33d7bcddbbfa394a = function() { return handleError(function (arg0, arg1) {\n        const ret = getObject(arg0).call(getObject(arg1));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_next_726d1c2255989269 = function(arg0) {\n        const ret = getObject(arg0).next;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_self_fd00a1ef86d1b2ed = function() { return handleError(function () {\n        const ret = self.self;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_window_6f6e346d8bbd61d7 = function() { return handleError(function () {\n        const ret = window.window;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_globalThis_3348936ac49df00a = function() { return handleError(function () {\n        const ret = globalThis.globalThis;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_global_67175caf56f55ca9 = function() { return handleError(function () {\n        const ret = global.global;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_newnoargs_971e9a5abe185139 = function(arg0, arg1) {\n        const ret = new Function(getStringFromWasm0(arg0, arg1));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_set_1a930cfcda1a8067 = function(arg0, arg1, arg2) {\n        getObject(arg0).set(getObject(arg1), arg2 >>> 0);\n    };\n    imports.wbg.__wbg_length_51f19f73d6d9eff3 = function(arg0) {\n        const ret = getObject(arg0).length;\n        return ret;\n    };\n    imports.wbg.__wbg_has_3be27932089d278e = function() { return handleError(function (arg0, arg1) {\n        const ret = Reflect.has(getObject(arg0), getObject(arg1));\n        return ret;\n    }, arguments) };\n    imports.wbg.__wbg_set_2762e698c2f5b7e0 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));\n        return ret;\n    }, arguments) };\n    imports.wbg.__wbg_randomFillSync_91e2b39becca6147 = function() { return handleError(function (arg0, arg1, arg2) {\n        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));\n    }, arguments) };\n    imports.wbg.__wbg_subarray_270ff8dd5582c1ac = function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_getRandomValues_b14734aa289bc356 = function() { return handleError(function (arg0, arg1) {\n        getObject(arg0).getRandomValues(getObject(arg1));\n    }, arguments) };\n    imports.wbg.__wbg_self_86b4b13392c7af56 = function() { return handleError(function () {\n        const ret = self.self;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_crypto_b8c92eaac23d0d80 = function(arg0) {\n        const ret = getObject(arg0).crypto;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_msCrypto_9ad6677321a08dd8 = function(arg0) {\n        const ret = getObject(arg0).msCrypto;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_static_accessor_MODULE_452b4680e8614c81 = function() {\n        const ret = module;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_require_f5521a5b85ad2542 = function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_getRandomValues_dd27e6b0652b3236 = function(arg0) {\n        const ret = getObject(arg0).getRandomValues;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_randomFillSync_d2ba53160aec6aba = function(arg0, arg1, arg2) {\n        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));\n    };\n    imports.wbg.__wbg_getRandomValues_e57c9b75ddead065 = function(arg0, arg1) {\n        getObject(arg0).getRandomValues(getObject(arg1));\n    };\n    imports.wbg.__wbg_instanceof_Uint8Array_36c37b9ca15e3e0a = function(arg0) {\n        const ret = getObject(arg0) instanceof Uint8Array;\n        return ret;\n    };\n    imports.wbg.__wbg_put_e193e5c9c96e937f = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_delete_1ca98818fdc40291 = function() { return handleError(function (arg0, arg1) {\n        const ret = getObject(arg0).delete(getObject(arg1));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_setTimeout_b9c1670391a219b8 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);\n        return ret;\n    }, arguments) };\n    imports.wbg.__wbg_clearTimeout_2b1d235f7a5ba907 = function(arg0, arg1) {\n        getObject(arg0).clearTimeout(arg1);\n    };\n    imports.wbg.__wbg_newwithstrandinit_de7c409ec8538105 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_headers_0aeca08d4e61e2e7 = function(arg0) {\n        const ret = getObject(arg0).headers;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_set_b5c36262f65fae92 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {\n        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));\n    }, arguments) };\n    imports.wbg.__wbg_fetch_9a5cb9d8a96004d0 = function(arg0, arg1) {\n        const ret = getObject(arg0).fetch(getObject(arg1));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_instanceof_Response_240e67e5796c3c6b = function(arg0) {\n        const ret = getObject(arg0) instanceof Response;\n        return ret;\n    };\n    imports.wbg.__wbg_status_9067c6a4fdd064c9 = function(arg0) {\n        const ret = getObject(arg0).status;\n        return ret;\n    };\n    imports.wbg.__wbg_url_0f503b904b694ff5 = function(arg0, arg1) {\n        const ret = getObject(arg1).url;\n        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_setonversionchange_9061b53c8285029c = function(arg0, arg1) {\n        getObject(arg0).onversionchange = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonupgradeneeded_8956d6214819f478 = function(arg0, arg1) {\n        getObject(arg0).onupgradeneeded = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonblocked_99ef29b25a6726f0 = function(arg0, arg1) {\n        getObject(arg0).onblocked = getObject(arg1);\n    };\n    imports.wbg.__wbg_message_07e9066c9045403b = function(arg0, arg1) {\n        const ret = getObject(arg1).message;\n        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbg_stringify_d8d1ee75d5b55ce4 = function() { return handleError(function (arg0) {\n        const ret = JSON.stringify(getObject(arg0));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_Window_e2d90a08fe8bf335 = function(arg0) {\n        const ret = getObject(arg0).Window;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_WorkerGlobalScope_e36777b81ac97fe3 = function(arg0) {\n        const ret = getObject(arg0).WorkerGlobalScope;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_indexedDB_25d12ace6cb91d5a = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).indexedDB;\n        return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_indexedDB_6df068f0d15cbbfe = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).indexedDB;\n        return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_open_2a1e9120d3d8897d = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_send_56ace0158235d307 = function() { return handleError(function (arg0, arg1, arg2) {\n        getObject(arg0).send(getStringFromWasm0(arg1, arg2));\n    }, arguments) };\n    imports.wbg.__wbg_data_63829cccb08a0246 = function(arg0) {\n        const ret = getObject(arg0).data;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_newwithstr_3e7cf2650b0b22a7 = function() { return handleError(function (arg0, arg1, arg2, arg3) {\n        const ret = new WebSocket(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_new_875d595b7582236e = function() { return handleError(function (arg0, arg1) {\n        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_setonmessage_7ff15f986bd94ef0 = function(arg0, arg1) {\n        getObject(arg0).onmessage = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonopen_e58b724aa21610a4 = function(arg0, arg1) {\n        getObject(arg0).onopen = getObject(arg1);\n    };\n    imports.wbg.__wbg_setonerror_3375cf6162c60ad1 = function(arg0, arg1) {\n        getObject(arg0).onerror = getObject(arg1);\n    };\n    imports.wbg.__wbg_objectStoreNames_d11a3d06e3226638 = function(arg0) {\n        const ret = getObject(arg0).objectStoreNames;\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_createObjectStore_84b6922280a33472 = function() { return handleError(function (arg0, arg1, arg2) {\n        const ret = getObject(arg0).createObjectStore(getStringFromWasm0(arg1, arg2));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_instanceof_Error_2082612c1902c887 = function(arg0) {\n        const ret = getObject(arg0) instanceof Error;\n        return ret;\n    };\n    imports.wbg.__wbg_getTimezoneOffset_8a39b51acb4f52c9 = function(arg0) {\n        const ret = getObject(arg0).getTimezoneOffset();\n        return ret;\n    };\n    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {\n        const ret = debugString(getObject(arg1));\n        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n        const len0 = WASM_VECTOR_LEN;\n        getInt32Memory0()[arg0 / 4 + 1] = len0;\n        getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n    };\n    imports.wbg.__wbindgen_throw = function(arg0, arg1) {\n        throw new Error(getStringFromWasm0(arg0, arg1));\n    };\n    imports.wbg.__wbg_then_e5489f796341454b = function(arg0, arg1, arg2) {\n        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_resolve_0107b3a501450ba0 = function(arg0) {\n        const ret = Promise.resolve(getObject(arg0));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_then_18da6e5453572fc8 = function(arg0, arg1) {\n        const ret = getObject(arg0).then(getObject(arg1));\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbg_result_4b44b0d900b4ab6f = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).result;\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_error_c872d3f7251736f1 = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).error;\n        return isLikeNone(ret) ? 0 : addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_get_28f9ffc7eb5802f3 = function() { return handleError(function (arg0, arg1) {\n        const ret = getObject(arg0).get(getObject(arg1));\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbg_instanceof_Window_42f092928baaee84 = function(arg0) {\n        const ret = true;\n        return ret;\n    };\n    imports.wbg.__wbg_close_23fa900ecee13ee4 = function() { return handleError(function (arg0) {\n        getObject(arg0).close();\n    }, arguments) };\n    imports.wbg.__wbg_text_64ed39439c06af3f = function() { return handleError(function (arg0) {\n        const ret = getObject(arg0).text();\n        return addHeapObject(ret);\n    }, arguments) };\n    imports.wbg.__wbindgen_closure_wrapper908 = function(arg0, arg1, arg2) {\n        const ret = makeClosure(arg0, arg1, 46, __wbg_adapter_36);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper920 = function(arg0, arg1, arg2) {\n        const ret = makeClosure(arg0, arg1, 43, __wbg_adapter_39);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper6293 = function(arg0, arg1, arg2) {\n        const ret = makeMutClosure(arg0, arg1, 234, __wbg_adapter_42);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper6993 = function(arg0, arg1, arg2) {\n        const ret = makeMutClosure(arg0, arg1, 243, __wbg_adapter_45);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper7292 = function(arg0, arg1, arg2) {\n        const ret = makeMutClosure(arg0, arg1, 240, __wbg_adapter_48);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper7293 = function(arg0, arg1, arg2) {\n        const ret = makeMutClosure(arg0, arg1, 1187, __wbg_adapter_51);\n        return addHeapObject(ret);\n    };\n    imports.wbg.__wbindgen_closure_wrapper7294 = function(arg0, arg1, arg2) {\n        const ret = makeMutClosure(arg0, arg1, 237, __wbg_adapter_54);\n        return addHeapObject(ret);\n    };\n\n    return imports;\n}\n\nfunction initMemory(imports, maybe_memory) {\n\n}\n\nfunction finalizeInit(instance, module) {\n    wasm = instance.exports;\n    init.__wbindgen_wasm_module = module;\n    cachedFloat64Memory0 = new Float64Array();\n    cachedInt32Memory0 = new Int32Array();\n    cachedUint8Memory0 = new Uint8Array();\n\n\n    return wasm;\n}\n\nfunction initSync(bytes) {\n    const imports = getImports();\n\n    initMemory(imports);\n\n    const module = new WebAssembly.Module(bytes);\n    const instance = new WebAssembly.Instance(module, imports);\n\n    return finalizeInit(instance, module);\n}\n\nasync function init(input) {\n    if (typeof input === 'undefined') {    }\n    const imports = getImports();\n\n    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {\n        input = fetch(input);\n    }\n\n    initMemory(imports);\n\n    const { instance, module } = await load(await input, imports);\n\n    return finalizeInit(instance, module);\n}\n\n\n//****************************************************************** WRAPPER END\n\nfunction replaceUndefinedWithNulls(value) {\n    if (value === undefined) {\n        return null;\n    }\n    if (value instanceof Blob) {\n        return value;\n    }\n    if (typeof value === \"object\" && value !== null) {\n        const result = Array.isArray(value) ? [] : {};\n        for (const key in value) {\n            result[key] = replaceUndefinedWithNulls(value[key]);\n        }\n        return result;\n    }\n    return value;\n};\n\nfunction core_response_handler(request_id, params, response_type, finished) {\n    postMessage({\n        type: 'response',\n        requestId: request_id,\n        params: replaceUndefinedWithNulls(params),\n        responseType: response_type,\n        finished,\n    });\n}\n\nasync function replaceBlobsWithArrayBuffers(value) {\n    if (value instanceof Blob) {\n        return await value.arrayBuffer();\n    }\n    if (typeof value === \"bigint\") {\n        if (value < Number.MAX_SAFE_INTEGER && value > Number.MIN_SAFE_INTEGER) {\n            return Number(value);\n        } else {\n            return value.toString();\n        }\n    }\n    if (typeof value === \"object\" && value !== null) {\n        const result = Array.isArray(value) ? [] : {};\n        for (const key in value) {\n            result[key] = await replaceBlobsWithArrayBuffers(value[key]);\n        }\n        return result;\n    }\n    return value;\n}\n\nself.onmessage = (e) => {\n    const message = e.data;\n    switch (message.type) {\n    case 'init':\n        (async () => {\n            await init(message.wasmModule);\n            postMessage({ type: 'init' });\n        })();\n        break;\n\n    case 'createContext':\n        postMessage({\n            type: 'createContext',\n            result: core_create_context(message.configJson),\n            requestId: message.requestId,\n        });\n        break;\n\n    case 'destroyContext':\n        core_destroy_context(message.context);\n        postMessage({\n            type: 'destroyContext'\n        });\n        break;\n\n    case 'request':\n        (async () => {\n            core_request(\n                message.context,\n                message.functionName,\n                await replaceBlobsWithArrayBuffers(message.functionParams),\n                message.requestId,\n            );\n        })();\n        break;\n    }\n};\n"], {type: "application/javascript"}),
                    t = URL.createObjectURL(e), n = new Worker(t);
                let r = 1;
                const o = new Map;
                let i = !1, a = null;
                return n.onmessage = e => {
                    const t = e.data;
                    switch (t.type) {
                        case"init":
                            i = !0;
                            for (const [e, t] of o.entries()) {
                                n.postMessage({
                                    type: "createContext",
                                    requestId: e,
                                    configJson: t.configJson
                                });
                            }
                            break;
                        case"createContext":
                            const e = o.get(t.requestId);
                            e && (o.delete(t.requestId), e.resolve(t.result));
                            break;
                        case"destroyContext":
                            break;
                        case"response":
                            a && a(t.requestId, t.params, t.responseType, t.finished)
                    }
                }, n.onerror = e => {
                    console.log("Error from Web Worker: " + e.message)
                }, (async () => {
                    n.postMessage({type: "init", wasmModule: await s()})
                })(), Promise.resolve({
                    setResponseParamsHandler: e => {
                        a = e
                    }, createContext: e => new Promise(t => {
                        const a = r;
                        r += 1, o.set(a, {configJson: e, resolve: t}), i && n.postMessage({
                            type: "createContext",
                            requestId: a,
                            configJson: e
                        })
                    }), destroyContext: e => {
                        n.postMessage({type: "destroyContext", context: e})
                    }, sendRequestParams: (e, t, r, o) => {
                        n.postMessage({type: "request", context: e, requestId: t, functionName: r, functionParams: o})
                    }
                })
            }()
        }
    }).call(this, n(12)(e), n(1))
}, function (e, t) {
    var n;
    n = function () {
        return this
    }();
    try {
        n = n || new Function("return this")()
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}, function (e, t, n) {
    "use strict";
    var r = this && this.__awaiter || function (e, t, n, r) {
        return new (n || (n = Promise))((function (o, i) {
            function a(e) {
                try {
                    c(r.next(e))
                } catch (e) {
                    i(e)
                }
            }

            function s(e) {
                try {
                    c(r.throw(e))
                } catch (e) {
                    i(e)
                }
            }

            function c(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                    e(t)
                }))).then(a, s)
            }

            c((r = r.apply(e, t || [])).next())
        }))
    };
    Object.defineProperty(t, "__esModule", {value: !0}), t.builderOpInteger = t.BocErrorCode = t.bocCacheTypeUnpinned = t.bocCacheTypePinned = t.AbiModule = t.messageSourceEncodingParams = t.messageSourceEncoded = t.stateInitSourceTvc = t.stateInitSourceStateInit = t.stateInitSourceMessage = t.MessageBodyType = t.signerSigningBox = t.signerKeys = t.signerExternal = t.signerNone = t.abiSerialized = t.abiHandle = t.abiJson = t.abiContract = t.AbiErrorCode = t.CryptoModule = t.resultOfAppEncryptionBoxDecrypt = t.resultOfAppEncryptionBoxEncrypt = t.resultOfAppEncryptionBoxGetInfo = t.paramsOfAppEncryptionBoxDecrypt = t.paramsOfAppEncryptionBoxEncrypt = t.paramsOfAppEncryptionBoxGetInfo = t.resultOfAppSigningBoxSign = t.resultOfAppSigningBoxGetPublicKey = t.paramsOfAppSigningBoxSign = t.paramsOfAppSigningBoxGetPublicKey = t.resultOfAppPasswordProviderGetPassword = t.paramsOfAppPasswordProviderGetPassword = t.boxEncryptionAlgorithmNaclSecretBox = t.boxEncryptionAlgorithmNaclBox = t.boxEncryptionAlgorithmChaCha20 = t.cryptoBoxSecretEncryptedSecret = t.cryptoBoxSecretPredefinedSeedPhrase = t.cryptoBoxSecretRandomSeedPhrase = t.CipherMode = t.encryptionAlgorithmNaclSecretBox = t.encryptionAlgorithmNaclBox = t.encryptionAlgorithmChaCha20 = t.encryptionAlgorithmAES = t.CryptoErrorCode = t.ClientModule = t.appRequestResultOk = t.appRequestResultError = t.NetworkQueriesProtocol = t.ClientErrorCode = void 0, t.resultOfAppDebotBrowserInput = t.paramsOfAppDebotBrowserApprove = t.paramsOfAppDebotBrowserSend = t.paramsOfAppDebotBrowserInvokeDebot = t.paramsOfAppDebotBrowserGetSigningBox = t.paramsOfAppDebotBrowserInput = t.paramsOfAppDebotBrowserShowAction = t.paramsOfAppDebotBrowserSwitchCompleted = t.paramsOfAppDebotBrowserSwitch = t.paramsOfAppDebotBrowserLog = t.debotActivityTransaction = t.DebotErrorCode = t.NetModule = t.AggregationFn = t.paramsOfQueryOperationQueryCounterparties = t.paramsOfQueryOperationAggregateCollection = t.paramsOfQueryOperationWaitForCollection = t.paramsOfQueryOperationQueryCollection = t.SortDirection = t.NetErrorCode = t.TvmModule = t.accountForExecutorAccount = t.accountForExecutorUninit = t.accountForExecutorNone = t.TvmErrorCode = t.UtilsModule = t.AccountAddressType = t.addressStringFormatBase64 = t.addressStringFormatHex = t.addressStringFormatAccountId = t.ProcessingModule = t.processingEventRempError = t.processingEventRempOther = t.processingEventRempIncludedIntoAcceptedBlock = t.processingEventRempIncludedIntoBlock = t.processingEventRempSentToValidators = t.processingEventMessageExpired = t.processingEventFetchNextBlockFailed = t.processingEventWillFetchNextBlock = t.processingEventSendFailed = t.processingEventDidSend = t.processingEventWillSend = t.processingEventFetchFirstBlockFailed = t.processingEventWillFetchFirstBlock = t.ProcessingErrorCode = t.BocModule = t.builderOpAddress = t.builderOpCellBoc = t.builderOpCell = t.builderOpBitString = void 0, t.ProofsModule = t.ProofsErrorCode = t.DebotModule = t.resultOfAppDebotBrowserApprove = t.resultOfAppDebotBrowserInvokeDebot = t.resultOfAppDebotBrowserGetSigningBox = void 0, function (e) {
        e[e.NotImplemented = 1] = "NotImplemented", e[e.InvalidHex = 2] = "InvalidHex", e[e.InvalidBase64 = 3] = "InvalidBase64", e[e.InvalidAddress = 4] = "InvalidAddress", e[e.CallbackParamsCantBeConvertedToJson = 5] = "CallbackParamsCantBeConvertedToJson", e[e.WebsocketConnectError = 6] = "WebsocketConnectError", e[e.WebsocketReceiveError = 7] = "WebsocketReceiveError", e[e.WebsocketSendError = 8] = "WebsocketSendError", e[e.HttpClientCreateError = 9] = "HttpClientCreateError", e[e.HttpRequestCreateError = 10] = "HttpRequestCreateError", e[e.HttpRequestSendError = 11] = "HttpRequestSendError", e[e.HttpRequestParseError = 12] = "HttpRequestParseError", e[e.CallbackNotRegistered = 13] = "CallbackNotRegistered", e[e.NetModuleNotInit = 14] = "NetModuleNotInit", e[e.InvalidConfig = 15] = "InvalidConfig", e[e.CannotCreateRuntime = 16] = "CannotCreateRuntime", e[e.InvalidContextHandle = 17] = "InvalidContextHandle", e[e.CannotSerializeResult = 18] = "CannotSerializeResult", e[e.CannotSerializeError = 19] = "CannotSerializeError", e[e.CannotConvertJsValueToJson = 20] = "CannotConvertJsValueToJson", e[e.CannotReceiveSpawnedResult = 21] = "CannotReceiveSpawnedResult", e[e.SetTimerError = 22] = "SetTimerError", e[e.InvalidParams = 23] = "InvalidParams", e[e.ContractsAddressConversionFailed = 24] = "ContractsAddressConversionFailed", e[e.UnknownFunction = 25] = "UnknownFunction", e[e.AppRequestError = 26] = "AppRequestError", e[e.NoSuchRequest = 27] = "NoSuchRequest", e[e.CanNotSendRequestResult = 28] = "CanNotSendRequestResult", e[e.CanNotReceiveRequestResult = 29] = "CanNotReceiveRequestResult", e[e.CanNotParseRequestResult = 30] = "CanNotParseRequestResult", e[e.UnexpectedCallbackResponse = 31] = "UnexpectedCallbackResponse", e[e.CanNotParseNumber = 32] = "CanNotParseNumber", e[e.InternalError = 33] = "InternalError", e[e.InvalidHandle = 34] = "InvalidHandle", e[e.LocalStorageError = 35] = "LocalStorageError"
    }(t.ClientErrorCode || (t.ClientErrorCode = {})), function (e) {
        e.HTTP = "HTTP", e.WS = "WS"
    }(t.NetworkQueriesProtocol || (t.NetworkQueriesProtocol = {})), t.appRequestResultError = function (e) {
        return {type: "Error", text: e}
    }, t.appRequestResultOk = function (e) {
        return {type: "Ok", result: e}
    };

    function o(e, t, n, o) {
        return r(this, void 0, void 0, (function* () {
            try {
                let r = {};
                switch (t.type) {
                    case"GetPassword":
                        r = yield e.get_password(t)
                }
                o.resolve_app_request(n, Object.assign({type: t.type}, r))
            } catch (e) {
                o.reject_app_request(n, e)
            }
        }))
    }

    function i(e, t, n, o) {
        return r(this, void 0, void 0, (function* () {
            try {
                let r = {};
                switch (t.type) {
                    case"GetPublicKey":
                        r = yield e.get_public_key();
                        break;
                    case"Sign":
                        r = yield e.sign(t)
                }
                o.resolve_app_request(n, Object.assign({type: t.type}, r))
            } catch (e) {
                o.reject_app_request(n, e)
            }
        }))
    }

    function a(e, t, n, o) {
        return r(this, void 0, void 0, (function* () {
            try {
                let r = {};
                switch (t.type) {
                    case"GetInfo":
                        r = yield e.get_info();
                        break;
                    case"Encrypt":
                        r = yield e.encrypt(t);
                        break;
                    case"Decrypt":
                        r = yield e.decrypt(t)
                }
                o.resolve_app_request(n, Object.assign({type: t.type}, r))
            } catch (e) {
                o.reject_app_request(n, e)
            }
        }))
    }

    t.ClientModule = class {
        constructor(e) {
            this.client = e
        }

        get_api_reference() {
            return this.client.request("client.get_api_reference")
        }

        version() {
            return this.client.request("client.version")
        }

        config() {
            return this.client.request("client.config")
        }

        build_info() {
            return this.client.request("client.build_info")
        }

        resolve_app_request(e) {
            return this.client.request("client.resolve_app_request", e)
        }
    }, function (e) {
        e[e.InvalidPublicKey = 100] = "InvalidPublicKey", e[e.InvalidSecretKey = 101] = "InvalidSecretKey", e[e.InvalidKey = 102] = "InvalidKey", e[e.InvalidFactorizeChallenge = 106] = "InvalidFactorizeChallenge", e[e.InvalidBigInt = 107] = "InvalidBigInt", e[e.ScryptFailed = 108] = "ScryptFailed", e[e.InvalidKeySize = 109] = "InvalidKeySize", e[e.NaclSecretBoxFailed = 110] = "NaclSecretBoxFailed", e[e.NaclBoxFailed = 111] = "NaclBoxFailed", e[e.NaclSignFailed = 112] = "NaclSignFailed", e[e.Bip39InvalidEntropy = 113] = "Bip39InvalidEntropy", e[e.Bip39InvalidPhrase = 114] = "Bip39InvalidPhrase", e[e.Bip32InvalidKey = 115] = "Bip32InvalidKey", e[e.Bip32InvalidDerivePath = 116] = "Bip32InvalidDerivePath", e[e.Bip39InvalidDictionary = 117] = "Bip39InvalidDictionary", e[e.Bip39InvalidWordCount = 118] = "Bip39InvalidWordCount", e[e.MnemonicGenerationFailed = 119] = "MnemonicGenerationFailed", e[e.MnemonicFromEntropyFailed = 120] = "MnemonicFromEntropyFailed", e[e.SigningBoxNotRegistered = 121] = "SigningBoxNotRegistered", e[e.InvalidSignature = 122] = "InvalidSignature", e[e.EncryptionBoxNotRegistered = 123] = "EncryptionBoxNotRegistered", e[e.InvalidIvSize = 124] = "InvalidIvSize", e[e.UnsupportedCipherMode = 125] = "UnsupportedCipherMode", e[e.CannotCreateCipher = 126] = "CannotCreateCipher", e[e.EncryptDataError = 127] = "EncryptDataError", e[e.DecryptDataError = 128] = "DecryptDataError", e[e.IvRequired = 129] = "IvRequired", e[e.CryptoBoxNotRegistered = 130] = "CryptoBoxNotRegistered", e[e.InvalidCryptoBoxType = 131] = "InvalidCryptoBoxType", e[e.CryptoBoxSecretSerializationError = 132] = "CryptoBoxSecretSerializationError", e[e.CryptoBoxSecretDeserializationError = 133] = "CryptoBoxSecretDeserializationError", e[e.InvalidNonceSize = 134] = "InvalidNonceSize"
    }(t.CryptoErrorCode || (t.CryptoErrorCode = {})), t.encryptionAlgorithmAES = function (e) {
        return Object.assign({type: "AES"}, e)
    }, t.encryptionAlgorithmChaCha20 = function (e) {
        return Object.assign({type: "ChaCha20"}, e)
    }, t.encryptionAlgorithmNaclBox = function (e) {
        return Object.assign({type: "NaclBox"}, e)
    }, t.encryptionAlgorithmNaclSecretBox = function (e) {
        return Object.assign({type: "NaclSecretBox"}, e)
    }, function (e) {
        e.CBC = "CBC", e.CFB = "CFB", e.CTR = "CTR", e.ECB = "ECB", e.OFB = "OFB"
    }(t.CipherMode || (t.CipherMode = {})), t.cryptoBoxSecretRandomSeedPhrase = function (e, t) {
        return {type: "RandomSeedPhrase", dictionary: e, wordcount: t}
    }, t.cryptoBoxSecretPredefinedSeedPhrase = function (e, t, n) {
        return {type: "PredefinedSeedPhrase", phrase: e, dictionary: t, wordcount: n}
    }, t.cryptoBoxSecretEncryptedSecret = function (e) {
        return {type: "EncryptedSecret", encrypted_secret: e}
    }, t.boxEncryptionAlgorithmChaCha20 = function (e) {
        return Object.assign({type: "ChaCha20"}, e)
    }, t.boxEncryptionAlgorithmNaclBox = function (e) {
        return Object.assign({type: "NaclBox"}, e)
    }, t.boxEncryptionAlgorithmNaclSecretBox = function (e) {
        return Object.assign({type: "NaclSecretBox"}, e)
    }, t.paramsOfAppPasswordProviderGetPassword = function (e) {
        return {type: "GetPassword", encryption_public_key: e}
    }, t.resultOfAppPasswordProviderGetPassword = function (e, t) {
        return {type: "GetPassword", encrypted_password: e, app_encryption_pubkey: t}
    }, t.paramsOfAppSigningBoxGetPublicKey = function () {
        return {type: "GetPublicKey"}
    }, t.paramsOfAppSigningBoxSign = function (e) {
        return {type: "Sign", unsigned: e}
    }, t.resultOfAppSigningBoxGetPublicKey = function (e) {
        return {type: "GetPublicKey", public_key: e}
    }, t.resultOfAppSigningBoxSign = function (e) {
        return {type: "Sign", signature: e}
    }, t.paramsOfAppEncryptionBoxGetInfo = function () {
        return {type: "GetInfo"}
    }, t.paramsOfAppEncryptionBoxEncrypt = function (e) {
        return {type: "Encrypt", data: e}
    }, t.paramsOfAppEncryptionBoxDecrypt = function (e) {
        return {type: "Decrypt", data: e}
    }, t.resultOfAppEncryptionBoxGetInfo = function (e) {
        return {type: "GetInfo", info: e}
    }, t.resultOfAppEncryptionBoxEncrypt = function (e) {
        return {type: "Encrypt", data: e}
    }, t.resultOfAppEncryptionBoxDecrypt = function (e) {
        return {type: "Decrypt", data: e}
    };
    t.CryptoModule = class {
        constructor(e) {
            this.client = e
        }

        factorize(e) {
            return this.client.request("crypto.factorize", e)
        }

        modular_power(e) {
            return this.client.request("crypto.modular_power", e)
        }

        ton_crc16(e) {
            return this.client.request("crypto.ton_crc16", e)
        }

        generate_random_bytes(e) {
            return this.client.request("crypto.generate_random_bytes", e)
        }

        convert_public_key_to_ton_safe_format(e) {
            return this.client.request("crypto.convert_public_key_to_ton_safe_format", e)
        }

        generate_random_sign_keys() {
            return this.client.request("crypto.generate_random_sign_keys")
        }

        sign(e) {
            return this.client.request("crypto.sign", e)
        }

        verify_signature(e) {
            return this.client.request("crypto.verify_signature", e)
        }

        sha256(e) {
            return this.client.request("crypto.sha256", e)
        }

        sha512(e) {
            return this.client.request("crypto.sha512", e)
        }

        scrypt(e) {
            return this.client.request("crypto.scrypt", e)
        }

        nacl_sign_keypair_from_secret_key(e) {
            return this.client.request("crypto.nacl_sign_keypair_from_secret_key", e)
        }

        nacl_sign(e) {
            return this.client.request("crypto.nacl_sign", e)
        }

        nacl_sign_open(e) {
            return this.client.request("crypto.nacl_sign_open", e)
        }

        nacl_sign_detached(e) {
            return this.client.request("crypto.nacl_sign_detached", e)
        }

        nacl_sign_detached_verify(e) {
            return this.client.request("crypto.nacl_sign_detached_verify", e)
        }

        nacl_box_keypair() {
            return this.client.request("crypto.nacl_box_keypair")
        }

        nacl_box_keypair_from_secret_key(e) {
            return this.client.request("crypto.nacl_box_keypair_from_secret_key", e)
        }

        nacl_box(e) {
            return this.client.request("crypto.nacl_box", e)
        }

        nacl_box_open(e) {
            return this.client.request("crypto.nacl_box_open", e)
        }

        nacl_secret_box(e) {
            return this.client.request("crypto.nacl_secret_box", e)
        }

        nacl_secret_box_open(e) {
            return this.client.request("crypto.nacl_secret_box_open", e)
        }

        mnemonic_words(e) {
            return this.client.request("crypto.mnemonic_words", e)
        }

        mnemonic_from_random(e) {
            return this.client.request("crypto.mnemonic_from_random", e)
        }

        mnemonic_from_entropy(e) {
            return this.client.request("crypto.mnemonic_from_entropy", e)
        }

        mnemonic_verify(e) {
            return this.client.request("crypto.mnemonic_verify", e)
        }

        mnemonic_derive_sign_keys(e) {
            return this.client.request("crypto.mnemonic_derive_sign_keys", e)
        }

        hdkey_xprv_from_mnemonic(e) {
            return this.client.request("crypto.hdkey_xprv_from_mnemonic", e)
        }

        hdkey_derive_from_xprv(e) {
            return this.client.request("crypto.hdkey_derive_from_xprv", e)
        }

        hdkey_derive_from_xprv_path(e) {
            return this.client.request("crypto.hdkey_derive_from_xprv_path", e)
        }

        hdkey_secret_from_xprv(e) {
            return this.client.request("crypto.hdkey_secret_from_xprv", e)
        }

        hdkey_public_from_xprv(e) {
            return this.client.request("crypto.hdkey_public_from_xprv", e)
        }

        chacha20(e) {
            return this.client.request("crypto.chacha20", e)
        }

        create_crypto_box(e, t) {
            return this.client.request("crypto.create_crypto_box", e, (e, n) => {
                3 === n ? o(t, e.request_data, e.app_request_id, this.client) : 4 === n && o(t, e, null, this.client)
            })
        }

        remove_crypto_box(e) {
            return this.client.request("crypto.remove_crypto_box", e)
        }

        get_crypto_box_info(e) {
            return this.client.request("crypto.get_crypto_box_info", e)
        }

        get_crypto_box_seed_phrase(e) {
            return this.client.request("crypto.get_crypto_box_seed_phrase", e)
        }

        get_signing_box_from_crypto_box(e) {
            return this.client.request("crypto.get_signing_box_from_crypto_box", e)
        }

        get_encryption_box_from_crypto_box(e) {
            return this.client.request("crypto.get_encryption_box_from_crypto_box", e)
        }

        clear_crypto_box_secret_cache(e) {
            return this.client.request("crypto.clear_crypto_box_secret_cache", e)
        }

        register_signing_box(e) {
            return this.client.request("crypto.register_signing_box", void 0, (t, n) => {
                3 === n ? i(e, t.request_data, t.app_request_id, this.client) : 4 === n && i(e, t, null, this.client)
            })
        }

        get_signing_box(e) {
            return this.client.request("crypto.get_signing_box", e)
        }

        signing_box_get_public_key(e) {
            return this.client.request("crypto.signing_box_get_public_key", e)
        }

        signing_box_sign(e) {
            return this.client.request("crypto.signing_box_sign", e)
        }

        remove_signing_box(e) {
            return this.client.request("crypto.remove_signing_box", e)
        }

        register_encryption_box(e) {
            return this.client.request("crypto.register_encryption_box", void 0, (t, n) => {
                3 === n ? a(e, t.request_data, t.app_request_id, this.client) : 4 === n && a(e, t, null, this.client)
            })
        }

        remove_encryption_box(e) {
            return this.client.request("crypto.remove_encryption_box", e)
        }

        encryption_box_get_info(e) {
            return this.client.request("crypto.encryption_box_get_info", e)
        }

        encryption_box_encrypt(e) {
            return this.client.request("crypto.encryption_box_encrypt", e)
        }

        encryption_box_decrypt(e) {
            return this.client.request("crypto.encryption_box_decrypt", e)
        }

        create_encryption_box(e) {
            return this.client.request("crypto.create_encryption_box", e)
        }
    }, function (e) {
        e[e.RequiredAddressMissingForEncodeMessage = 301] = "RequiredAddressMissingForEncodeMessage", e[e.RequiredCallSetMissingForEncodeMessage = 302] = "RequiredCallSetMissingForEncodeMessage", e[e.InvalidJson = 303] = "InvalidJson", e[e.InvalidMessage = 304] = "InvalidMessage", e[e.EncodeDeployMessageFailed = 305] = "EncodeDeployMessageFailed", e[e.EncodeRunMessageFailed = 306] = "EncodeRunMessageFailed", e[e.AttachSignatureFailed = 307] = "AttachSignatureFailed", e[e.InvalidTvcImage = 308] = "InvalidTvcImage", e[e.RequiredPublicKeyMissingForFunctionHeader = 309] = "RequiredPublicKeyMissingForFunctionHeader", e[e.InvalidSigner = 310] = "InvalidSigner", e[e.InvalidAbi = 311] = "InvalidAbi", e[e.InvalidFunctionId = 312] = "InvalidFunctionId", e[e.InvalidData = 313] = "InvalidData", e[e.EncodeInitialDataFailed = 314] = "EncodeInitialDataFailed", e[e.InvalidFunctionName = 315] = "InvalidFunctionName"
    }(t.AbiErrorCode || (t.AbiErrorCode = {})), t.abiContract = function (e) {
        return {type: "Contract", value: e}
    }, t.abiJson = function (e) {
        return {type: "Json", value: e}
    }, t.abiHandle = function (e) {
        return {type: "Handle", value: e}
    }, t.abiSerialized = function (e) {
        return {type: "Serialized", value: e}
    }, t.signerNone = function () {
        return {type: "None"}
    }, t.signerExternal = function (e) {
        return {type: "External", public_key: e}
    }, t.signerKeys = function (e) {
        return {type: "Keys", keys: e}
    }, t.signerSigningBox = function (e) {
        return {type: "SigningBox", handle: e}
    }, function (e) {
        e.Input = "Input", e.Output = "Output", e.InternalOutput = "InternalOutput", e.Event = "Event"
    }(t.MessageBodyType || (t.MessageBodyType = {})), t.stateInitSourceMessage = function (e) {
        return {type: "Message", source: e}
    }, t.stateInitSourceStateInit = function (e, t, n) {
        return {type: "StateInit", code: e, data: t, library: n}
    }, t.stateInitSourceTvc = function (e, t, n) {
        return {type: "Tvc", tvc: e, public_key: t, init_params: n}
    }, t.messageSourceEncoded = function (e, t) {
        return {type: "Encoded", message: e, abi: t}
    }, t.messageSourceEncodingParams = function (e) {
        return Object.assign({type: "EncodingParams"}, e)
    };
    t.AbiModule = class {
        constructor(e) {
            this.client = e
        }

        encode_message_body(e) {
            return this.client.request("abi.encode_message_body", e)
        }

        attach_signature_to_message_body(e) {
            return this.client.request("abi.attach_signature_to_message_body", e)
        }

        encode_message(e) {
            return this.client.request("abi.encode_message", e)
        }

        encode_internal_message(e) {
            return this.client.request("abi.encode_internal_message", e)
        }

        attach_signature(e) {
            return this.client.request("abi.attach_signature", e)
        }

        decode_message(e) {
            return this.client.request("abi.decode_message", e)
        }

        decode_message_body(e) {
            return this.client.request("abi.decode_message_body", e)
        }

        encode_account(e) {
            return this.client.request("abi.encode_account", e)
        }

        decode_account_data(e) {
            return this.client.request("abi.decode_account_data", e)
        }

        update_initial_data(e) {
            return this.client.request("abi.update_initial_data", e)
        }

        encode_initial_data(e) {
            return this.client.request("abi.encode_initial_data", e)
        }

        decode_initial_data(e) {
            return this.client.request("abi.decode_initial_data", e)
        }

        decode_boc(e) {
            return this.client.request("abi.decode_boc", e)
        }

        encode_boc(e) {
            return this.client.request("abi.encode_boc", e)
        }

        calc_function_id(e) {
            return this.client.request("abi.calc_function_id", e)
        }
    }, t.bocCacheTypePinned = function (e) {
        return {type: "Pinned", pin: e}
    }, t.bocCacheTypeUnpinned = function () {
        return {type: "Unpinned"}
    }, function (e) {
        e[e.InvalidBoc = 201] = "InvalidBoc", e[e.SerializationError = 202] = "SerializationError", e[e.InappropriateBlock = 203] = "InappropriateBlock", e[e.MissingSourceBoc = 204] = "MissingSourceBoc", e[e.InsufficientCacheSize = 205] = "InsufficientCacheSize", e[e.BocRefNotFound = 206] = "BocRefNotFound", e[e.InvalidBocRef = 207] = "InvalidBocRef"
    }(t.BocErrorCode || (t.BocErrorCode = {})), t.builderOpInteger = function (e, t) {
        return {type: "Integer", size: e, value: t}
    }, t.builderOpBitString = function (e) {
        return {type: "BitString", value: e}
    }, t.builderOpCell = function (e) {
        return {type: "Cell", builder: e}
    }, t.builderOpCellBoc = function (e) {
        return {type: "CellBoc", boc: e}
    }, t.builderOpAddress = function (e) {
        return {type: "Address", address: e}
    };
    t.BocModule = class {
        constructor(e) {
            this.client = e
        }

        parse_message(e) {
            return this.client.request("boc.parse_message", e)
        }

        parse_transaction(e) {
            return this.client.request("boc.parse_transaction", e)
        }

        parse_account(e) {
            return this.client.request("boc.parse_account", e)
        }

        parse_block(e) {
            return this.client.request("boc.parse_block", e)
        }

        parse_shardstate(e) {
            return this.client.request("boc.parse_shardstate", e)
        }

        get_blockchain_config(e) {
            return this.client.request("boc.get_blockchain_config", e)
        }

        get_boc_hash(e) {
            return this.client.request("boc.get_boc_hash", e)
        }

        get_boc_depth(e) {
            return this.client.request("boc.get_boc_depth", e)
        }

        get_code_from_tvc(e) {
            return this.client.request("boc.get_code_from_tvc", e)
        }

        cache_get(e) {
            return this.client.request("boc.cache_get", e)
        }

        cache_set(e) {
            return this.client.request("boc.cache_set", e)
        }

        cache_unpin(e) {
            return this.client.request("boc.cache_unpin", e)
        }

        encode_boc(e) {
            return this.client.request("boc.encode_boc", e)
        }

        get_code_salt(e) {
            return this.client.request("boc.get_code_salt", e)
        }

        set_code_salt(e) {
            return this.client.request("boc.set_code_salt", e)
        }

        decode_tvc(e) {
            return this.client.request("boc.decode_tvc", e)
        }

        encode_tvc(e) {
            return this.client.request("boc.encode_tvc", e)
        }

        encode_external_in_message(e) {
            return this.client.request("boc.encode_external_in_message", e)
        }

        get_compiler_version(e) {
            return this.client.request("boc.get_compiler_version", e)
        }
    }, function (e) {
        e[e.MessageAlreadyExpired = 501] = "MessageAlreadyExpired", e[e.MessageHasNotDestinationAddress = 502] = "MessageHasNotDestinationAddress", e[e.CanNotBuildMessageCell = 503] = "CanNotBuildMessageCell", e[e.FetchBlockFailed = 504] = "FetchBlockFailed", e[e.SendMessageFailed = 505] = "SendMessageFailed", e[e.InvalidMessageBoc = 506] = "InvalidMessageBoc", e[e.MessageExpired = 507] = "MessageExpired", e[e.TransactionWaitTimeout = 508] = "TransactionWaitTimeout", e[e.InvalidBlockReceived = 509] = "InvalidBlockReceived", e[e.CanNotCheckBlockShard = 510] = "CanNotCheckBlockShard", e[e.BlockNotFound = 511] = "BlockNotFound", e[e.InvalidData = 512] = "InvalidData", e[e.ExternalSignerMustNotBeUsed = 513] = "ExternalSignerMustNotBeUsed", e[e.MessageRejected = 514] = "MessageRejected", e[e.InvalidRempStatus = 515] = "InvalidRempStatus", e[e.NextRempStatusTimeout = 516] = "NextRempStatusTimeout"
    }(t.ProcessingErrorCode || (t.ProcessingErrorCode = {})), t.processingEventWillFetchFirstBlock = function () {
        return {type: "WillFetchFirstBlock"}
    }, t.processingEventFetchFirstBlockFailed = function (e) {
        return {type: "FetchFirstBlockFailed", error: e}
    }, t.processingEventWillSend = function (e, t, n) {
        return {type: "WillSend", shard_block_id: e, message_id: t, message: n}
    }, t.processingEventDidSend = function (e, t, n) {
        return {type: "DidSend", shard_block_id: e, message_id: t, message: n}
    }, t.processingEventSendFailed = function (e, t, n, r) {
        return {type: "SendFailed", shard_block_id: e, message_id: t, message: n, error: r}
    }, t.processingEventWillFetchNextBlock = function (e, t, n) {
        return {type: "WillFetchNextBlock", shard_block_id: e, message_id: t, message: n}
    }, t.processingEventFetchNextBlockFailed = function (e, t, n, r) {
        return {type: "FetchNextBlockFailed", shard_block_id: e, message_id: t, message: n, error: r}
    }, t.processingEventMessageExpired = function (e, t, n) {
        return {type: "MessageExpired", message_id: e, message: t, error: n}
    }, t.processingEventRempSentToValidators = function (e, t, n) {
        return {type: "RempSentToValidators", message_id: e, timestamp: t, json: n}
    }, t.processingEventRempIncludedIntoBlock = function (e, t, n) {
        return {type: "RempIncludedIntoBlock", message_id: e, timestamp: t, json: n}
    }, t.processingEventRempIncludedIntoAcceptedBlock = function (e, t, n) {
        return {type: "RempIncludedIntoAcceptedBlock", message_id: e, timestamp: t, json: n}
    }, t.processingEventRempOther = function (e, t, n) {
        return {type: "RempOther", message_id: e, timestamp: t, json: n}
    }, t.processingEventRempError = function (e) {
        return {type: "RempError", error: e}
    };
    t.ProcessingModule = class {
        constructor(e) {
            this.client = e
        }

        send_message(e, t) {
            return this.client.request("processing.send_message", e, t)
        }

        wait_for_transaction(e, t) {
            return this.client.request("processing.wait_for_transaction", e, t)
        }

        process_message(e, t) {
            return this.client.request("processing.process_message", e, t)
        }
    }, t.addressStringFormatAccountId = function () {
        return {type: "AccountId"}
    }, t.addressStringFormatHex = function () {
        return {type: "Hex"}
    }, t.addressStringFormatBase64 = function (e, t, n) {
        return {type: "Base64", url: e, test: t, bounce: n}
    }, function (e) {
        e.AccountId = "AccountId", e.Hex = "Hex", e.Base64 = "Base64"
    }(t.AccountAddressType || (t.AccountAddressType = {}));
    t.UtilsModule = class {
        constructor(e) {
            this.client = e
        }

        convert_address(e) {
            return this.client.request("utils.convert_address", e)
        }

        get_address_type(e) {
            return this.client.request("utils.get_address_type", e)
        }

        calc_storage_fee(e) {
            return this.client.request("utils.calc_storage_fee", e)
        }

        compress_zstd(e) {
            return this.client.request("utils.compress_zstd", e)
        }

        decompress_zstd(e) {
            return this.client.request("utils.decompress_zstd", e)
        }
    }, function (e) {
        e[e.CanNotReadTransaction = 401] = "CanNotReadTransaction", e[e.CanNotReadBlockchainConfig = 402] = "CanNotReadBlockchainConfig", e[e.TransactionAborted = 403] = "TransactionAborted", e[e.InternalError = 404] = "InternalError", e[e.ActionPhaseFailed = 405] = "ActionPhaseFailed", e[e.AccountCodeMissing = 406] = "AccountCodeMissing", e[e.LowBalance = 407] = "LowBalance", e[e.AccountFrozenOrDeleted = 408] = "AccountFrozenOrDeleted", e[e.AccountMissing = 409] = "AccountMissing", e[e.UnknownExecutionError = 410] = "UnknownExecutionError", e[e.InvalidInputStack = 411] = "InvalidInputStack", e[e.InvalidAccountBoc = 412] = "InvalidAccountBoc", e[e.InvalidMessageType = 413] = "InvalidMessageType", e[e.ContractExecutionError = 414] = "ContractExecutionError"
    }(t.TvmErrorCode || (t.TvmErrorCode = {})), t.accountForExecutorNone = function () {
        return {type: "None"}
    }, t.accountForExecutorUninit = function () {
        return {type: "Uninit"}
    }, t.accountForExecutorAccount = function (e, t) {
        return {type: "Account", boc: e, unlimited_balance: t}
    };
    t.TvmModule = class {
        constructor(e) {
            this.client = e
        }

        run_executor(e) {
            return this.client.request("tvm.run_executor", e)
        }

        run_tvm(e) {
            return this.client.request("tvm.run_tvm", e)
        }

        run_get(e) {
            return this.client.request("tvm.run_get", e)
        }
    }, function (e) {
        e[e.QueryFailed = 601] = "QueryFailed", e[e.SubscribeFailed = 602] = "SubscribeFailed", e[e.WaitForFailed = 603] = "WaitForFailed", e[e.GetSubscriptionResultFailed = 604] = "GetSubscriptionResultFailed", e[e.InvalidServerResponse = 605] = "InvalidServerResponse", e[e.ClockOutOfSync = 606] = "ClockOutOfSync", e[e.WaitForTimeout = 607] = "WaitForTimeout", e[e.GraphqlError = 608] = "GraphqlError", e[e.NetworkModuleSuspended = 609] = "NetworkModuleSuspended", e[e.WebsocketDisconnected = 610] = "WebsocketDisconnected", e[e.NotSupported = 611] = "NotSupported", e[e.NoEndpointsProvided = 612] = "NoEndpointsProvided", e[e.GraphqlWebsocketInitError = 613] = "GraphqlWebsocketInitError", e[e.NetworkModuleResumed = 614] = "NetworkModuleResumed"
    }(t.NetErrorCode || (t.NetErrorCode = {})), function (e) {
        e.ASC = "ASC", e.DESC = "DESC"
    }(t.SortDirection || (t.SortDirection = {})), t.paramsOfQueryOperationQueryCollection = function (e) {
        return Object.assign({type: "QueryCollection"}, e)
    }, t.paramsOfQueryOperationWaitForCollection = function (e) {
        return Object.assign({type: "WaitForCollection"}, e)
    }, t.paramsOfQueryOperationAggregateCollection = function (e) {
        return Object.assign({type: "AggregateCollection"}, e)
    }, t.paramsOfQueryOperationQueryCounterparties = function (e) {
        return Object.assign({type: "QueryCounterparties"}, e)
    }, function (e) {
        e.COUNT = "COUNT", e.MIN = "MIN", e.MAX = "MAX", e.SUM = "SUM", e.AVERAGE = "AVERAGE"
    }(t.AggregationFn || (t.AggregationFn = {}));

    function s(e, t, n, o) {
        return r(this, void 0, void 0, (function* () {
            try {
                let r = {};
                switch (t.type) {
                    case"Log":
                        e.log(t);
                        break;
                    case"Switch":
                        e.switch(t);
                        break;
                    case"SwitchCompleted":
                        e.switch_completed();
                        break;
                    case"ShowAction":
                        e.show_action(t);
                        break;
                    case"Input":
                        r = yield e.input(t);
                        break;
                    case"GetSigningBox":
                        r = yield e.get_signing_box();
                        break;
                    case"InvokeDebot":
                        yield e.invoke_debot(t);
                        break;
                    case"Send":
                        e.send(t);
                        break;
                    case"Approve":
                        r = yield e.approve(t)
                }
                o.resolve_app_request(n, Object.assign({type: t.type}, r))
            } catch (e) {
                o.reject_app_request(n, e)
            }
        }))
    }

    t.NetModule = class {
        constructor(e) {
            this.client = e
        }

        query(e) {
            return this.client.request("net.query", e)
        }

        batch_query(e) {
            return this.client.request("net.batch_query", e)
        }

        query_collection(e) {
            return this.client.request("net.query_collection", e)
        }

        aggregate_collection(e) {
            return this.client.request("net.aggregate_collection", e)
        }

        wait_for_collection(e) {
            return this.client.request("net.wait_for_collection", e)
        }

        unsubscribe(e) {
            return this.client.request("net.unsubscribe", e)
        }

        subscribe_collection(e, t) {
            return this.client.request("net.subscribe_collection", e, t)
        }

        subscribe(e, t) {
            return this.client.request("net.subscribe", e, t)
        }

        suspend() {
            return this.client.request("net.suspend")
        }

        resume() {
            return this.client.request("net.resume")
        }

        find_last_shard_block(e) {
            return this.client.request("net.find_last_shard_block", e)
        }

        fetch_endpoints() {
            return this.client.request("net.fetch_endpoints")
        }

        set_endpoints(e) {
            return this.client.request("net.set_endpoints", e)
        }

        get_endpoints() {
            return this.client.request("net.get_endpoints")
        }

        query_counterparties(e) {
            return this.client.request("net.query_counterparties", e)
        }

        query_transaction_tree(e) {
            return this.client.request("net.query_transaction_tree", e)
        }

        create_block_iterator(e) {
            return this.client.request("net.create_block_iterator", e)
        }

        resume_block_iterator(e) {
            return this.client.request("net.resume_block_iterator", e)
        }

        create_transaction_iterator(e) {
            return this.client.request("net.create_transaction_iterator", e)
        }

        resume_transaction_iterator(e) {
            return this.client.request("net.resume_transaction_iterator", e)
        }

        iterator_next(e) {
            return this.client.request("net.iterator_next", e)
        }

        remove_iterator(e) {
            return this.client.request("net.remove_iterator", e)
        }
    }, function (e) {
        e[e.DebotStartFailed = 801] = "DebotStartFailed", e[e.DebotFetchFailed = 802] = "DebotFetchFailed", e[e.DebotExecutionFailed = 803] = "DebotExecutionFailed", e[e.DebotInvalidHandle = 804] = "DebotInvalidHandle", e[e.DebotInvalidJsonParams = 805] = "DebotInvalidJsonParams", e[e.DebotInvalidFunctionId = 806] = "DebotInvalidFunctionId", e[e.DebotInvalidAbi = 807] = "DebotInvalidAbi", e[e.DebotGetMethodFailed = 808] = "DebotGetMethodFailed", e[e.DebotInvalidMsg = 809] = "DebotInvalidMsg", e[e.DebotExternalCallFailed = 810] = "DebotExternalCallFailed", e[e.DebotBrowserCallbackFailed = 811] = "DebotBrowserCallbackFailed", e[e.DebotOperationRejected = 812] = "DebotOperationRejected", e[e.DebotNoCode = 813] = "DebotNoCode"
    }(t.DebotErrorCode || (t.DebotErrorCode = {})), t.debotActivityTransaction = function (e, t, n, r, o, i, a) {
        return {type: "Transaction", msg: e, dst: t, out: n, fee: r, setcode: o, signkey: i, signing_box_handle: a}
    }, t.paramsOfAppDebotBrowserLog = function (e) {
        return {type: "Log", msg: e}
    }, t.paramsOfAppDebotBrowserSwitch = function (e) {
        return {type: "Switch", context_id: e}
    }, t.paramsOfAppDebotBrowserSwitchCompleted = function () {
        return {type: "SwitchCompleted"}
    }, t.paramsOfAppDebotBrowserShowAction = function (e) {
        return {type: "ShowAction", action: e}
    }, t.paramsOfAppDebotBrowserInput = function (e) {
        return {type: "Input", prompt: e}
    }, t.paramsOfAppDebotBrowserGetSigningBox = function () {
        return {type: "GetSigningBox"}
    }, t.paramsOfAppDebotBrowserInvokeDebot = function (e, t) {
        return {type: "InvokeDebot", debot_addr: e, action: t}
    }, t.paramsOfAppDebotBrowserSend = function (e) {
        return {type: "Send", message: e}
    }, t.paramsOfAppDebotBrowserApprove = function (e) {
        return {type: "Approve", activity: e}
    }, t.resultOfAppDebotBrowserInput = function (e) {
        return {type: "Input", value: e}
    }, t.resultOfAppDebotBrowserGetSigningBox = function (e) {
        return {type: "GetSigningBox", signing_box: e}
    }, t.resultOfAppDebotBrowserInvokeDebot = function () {
        return {type: "InvokeDebot"}
    }, t.resultOfAppDebotBrowserApprove = function (e) {
        return {type: "Approve", approved: e}
    };
    t.DebotModule = class {
        constructor(e) {
            this.client = e
        }

        init(e, t) {
            return this.client.request("debot.init", e, (e, n) => {
                3 === n ? s(t, e.request_data, e.app_request_id, this.client) : 4 === n && s(t, e, null, this.client)
            })
        }

        start(e) {
            return this.client.request("debot.start", e)
        }

        fetch(e) {
            return this.client.request("debot.fetch", e)
        }

        execute(e) {
            return this.client.request("debot.execute", e)
        }

        send(e) {
            return this.client.request("debot.send", e)
        }

        remove(e) {
            return this.client.request("debot.remove", e)
        }
    }, function (e) {
        e[e.InvalidData = 901] = "InvalidData", e[e.ProofCheckFailed = 902] = "ProofCheckFailed", e[e.InternalError = 903] = "InternalError", e[e.DataDiffersFromProven = 904] = "DataDiffersFromProven"
    }(t.ProofsErrorCode || (t.ProofsErrorCode = {}));
    t.ProofsModule = class {
        constructor(e) {
            this.client = e
        }

        proof_block_data(e) {
            return this.client.request("proofs.proof_block_data", e)
        }

        proof_transaction_data(e) {
            return this.client.request("proofs.proof_transaction_data", e)
        }

        proof_message_data(e) {
            return this.client.request("proofs.proof_message_data", e)
        }
    }
}, function (e, t, n) {
    "use strict";
    var r = this && this.__createBinding || (Object.create ? function (e, t, n, r) {
        void 0 === r && (r = n);
        var o = Object.getOwnPropertyDescriptor(t, n);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0, get: function () {
                return t[n]
            }
        }), Object.defineProperty(e, r, o)
    } : function (e, t, n, r) {
        void 0 === r && (r = n), e[r] = t[n]
    }), o = this && this.__exportStar || function (e, t) {
        for (var n in e) {
            "default" === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n)
        }
    };
    Object.defineProperty(t, "__esModule", {value: !0}), o(n(2), t), o(n(9), t)
}, function (e, t, n) {
    "use strict";
    n.r(t), function (e) {
        var t = n(3), r = n(0);
        let o = self;
        o.Buffer || (o.Buffer = e), o.tonclientWeb || (o.tonclientWeb = {
            TonClient: t.TonClient,
            libWeb: r.a,
            libWebSetup: r.b
        })
    }.call(this, n(5).Buffer)
}, function (e, t, n) {
    "use strict";
    (function (e) {
        /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
        var r = n(6), o = n(7), i = n(8);

        function a() {
            try {
                return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            } catch (e) {
                return 1073741823;
            }
        }

        function s(e, t) {
            if(a() < t) {
                throw new RangeError("Invalid typed array length");
            }
            return c.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = c.prototype : (null === e && (e = new c(t)), e.length = t), e
        }

        function c(e, t, n) {
            if(!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) {
                return new c(e, t, n);
            }
            if("number" == typeof e) {
                if("string" == typeof t) {
                    throw new Error("If encoding is specified then the first argument must be a string");
                }
                return g(this, e)
            }
            return u(this, e, t, n)
        }

        function u(e, t, n, r) {
            if("number" == typeof t) {
                throw new TypeError('"value" argument must not be a number');
            }
            return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, r) {
                if(t.byteLength, n < 0 || t.byteLength < n) {
                    throw new RangeError("'offset' is out of bounds");
                }
                if(t.byteLength < n + (r || 0)) {
                    throw new RangeError("'length' is out of bounds");
                }
                t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r);
                c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = d(e, t);
                return e
            }(e, t, n, r) : "string" == typeof t ? function (e, t, n) {
                "string" == typeof n && "" !== n || (n = "utf8");
                if(!c.isEncoding(n)) {
                    throw new TypeError('"encoding" must be a valid string encoding');
                }
                var r = 0 | f(t, n), o = (e = s(e, r)).write(t, n);
                o !== r && (e = e.slice(0, o));
                return e
            }(e, t, n) : function (e, t) {
                if(c.isBuffer(t)) {
                    var n = 0 | l(t.length);
                    return 0 === (e = s(e, n)).length || t.copy(e, 0, 0, n), e
                }
                if(t) {
                    if("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) {
                        return "number" != typeof t.length || (r = t.length) != r ? s(e, 0) : d(e, t);
                    }
                    if("Buffer" === t.type && i(t.data)) {
                        return d(e, t.data)
                    }
                }
                var r;
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }(e, t)
        }

        function _(e) {
            if("number" != typeof e) {
                throw new TypeError('"size" argument must be a number');
            }
            if(e < 0) {
                throw new RangeError('"size" argument must not be negative')
            }
        }

        function g(e, t) {
            if(_(t), e = s(e, t < 0 ? 0 : 0 | l(t)), !c.TYPED_ARRAY_SUPPORT) {
                for (var n = 0; n < t; ++n) {
                    e[n] = 0;
                }
            }
            return e
        }

        function d(e, t) {
            var n = t.length < 0 ? 0 : 0 | l(t.length);
            e = s(e, n);
            for (var r = 0; r < n; r += 1) {
                e[r] = 255 & t[r];
            }
            return e
        }

        function l(e) {
            if(e >= a()) {
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
            }
            return 0 | e
        }

        function f(e, t) {
            if(c.isBuffer(e)) {
                return e.length;
            }
            if("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) {
                return e.byteLength;
            }
            "string" != typeof e && (e = "" + e);
            var n = e.length;
            if(0 === n) {
                return 0;
            }
            for (var r = !1; ;) {
                switch (t) {
                    case"ascii":
                    case"latin1":
                    case"binary":
                        return n;
                    case"utf8":
                    case"utf-8":
                    case void 0:
                        return H(e).length;
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return 2 * n;
                    case"hex":
                        return n >>> 1;
                    case"base64":
                        return W(e).length;
                    default:
                        if(r) {
                            return H(e).length;
                        }
                        t = ("" + t).toLowerCase(), r = !0
                }
            }
        }

        function b(e, t, n) {
            var r = !1;
            if((void 0 === t || t < 0) && (t = 0), t > this.length) {
                return "";
            }
            if((void 0 === n || n > this.length) && (n = this.length), n <= 0) {
                return "";
            }
            if((n >>>= 0) <= (t >>>= 0)) {
                return "";
            }
            for (e || (e = "utf8"); ;) {
                switch (e) {
                    case"hex":
                        return I(this, t, n);
                    case"utf8":
                    case"utf-8":
                        return x(this, t, n);
                    case"ascii":
                        return j(this, t, n);
                    case"latin1":
                    case"binary":
                        return C(this, t, n);
                    case"base64":
                        return A(this, t, n);
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return B(this, t, n);
                    default:
                        if(r) {
                            throw new TypeError("Unknown encoding: " + e);
                        }
                        e = (e + "").toLowerCase(), r = !0
                }
            }
        }

        function p(e, t, n) {
            var r = e[t];
            e[t] = e[n], e[n] = r
        }

        function h(e, t, n, r, o) {
            if(0 === e.length) {
                return -1;
            }
            if("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = o ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
                if(o) {
                    return -1;
                }
                n = e.length - 1
            } else if(n < 0) {
                if(!o) {
                    return -1;
                }
                n = 0
            }
            if("string" == typeof t && (t = c.from(t, r)), c.isBuffer(t)) {
                return 0 === t.length ? -1 : w(e, t, n, r, o);
            }
            if("number" == typeof t) {
                return t &= 255, c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : w(e, [t], n, r, o);
            }
            throw new TypeError("val must be string, number or Buffer")
        }

        function w(e, t, n, r, o) {
            var i, a = 1, s = e.length, c = t.length;
            if(void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
                if(e.length < 2 || t.length < 2) {
                    return -1;
                }
                a = 2, s /= 2, c /= 2, n /= 2
            }

            function u(e, t) {
                return 1 === a ? e[t] : e.readUInt16BE(t * a)
            }

            if(o) {
                var _ = -1;
                for (i = n; i < s; i++) {
                    if(u(e, i) === u(t, -1 === _ ? 0 : i - _)) {
                        if(-1 === _ && (_ = i), i - _ + 1 === c) {
                            return _ * a
                        }
                    } else {
                        -1 !== _ && (i -= i - _), _ = -1
                    }
                }
            } else {
                for (n + c > s && (n = s - c), i = n; i >= 0; i--) {
                    for (var g = !0, d = 0; d < c; d++) {
                        if(u(e, i + d) !== u(t, d)) {
                            g = !1;
                            break
                        }
                    }
                    if(g) {
                        return i
                    }
                }
            }
            return -1
        }

        function m(e, t, n, r) {
            n = Number(n) || 0;
            var o = e.length - n;
            r ? (r = Number(r)) > o && (r = o) : r = o;
            var i = t.length;
            if(i % 2 != 0) {
                throw new TypeError("Invalid hex string");
            }
            r > i / 2 && (r = i / 2);
            for (var a = 0; a < r; ++a) {
                var s = parseInt(t.substr(2 * a, 2), 16);
                if(isNaN(s)) {
                    return a;
                }
                e[n + a] = s
            }
            return a
        }

        function y(e, t, n, r) {
            return U(H(t, e.length - n), e, n, r)
        }

        function v(e, t, n, r) {
            return U(function (e) {
                for (var t = [], n = 0; n < e.length; ++n) {
                    t.push(255 & e.charCodeAt(n));
                }
                return t
            }(t), e, n, r)
        }

        function O(e, t, n, r) {
            return v(e, t, n, r)
        }

        function E(e, t, n, r) {
            return U(W(t), e, n, r)
        }

        function S(e, t, n, r) {
            return U(function (e, t) {
                for (var n, r, o, i = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
                    n = e.charCodeAt(a), r = n >> 8, o = n % 256, i.push(o), i.push(r);
                }
                return i
            }(t, e.length - n), e, n, r)
        }

        function A(e, t, n) {
            return 0 === t && n === e.length ? r.fromByteArray(e) : r.fromByteArray(e.slice(t, n))
        }

        function x(e, t, n) {
            n = Math.min(e.length, n);
            for (var r = [], o = t; o < n;) {
                var i, a, s, c, u = e[o], _ = null, g = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
                if(o + g <= n) {
                    switch (g) {
                        case 1:
                            u < 128 && (_ = u);
                            break;
                        case 2:
                            128 == (192 & (i = e[o + 1])) && (c = (31 & u) << 6 | 63 & i) > 127 && (_ = c);
                            break;
                        case 3:
                            i = e[o + 1], a = e[o + 2], 128 == (192 & i) && 128 == (192 & a) && (c = (15 & u) << 12 | (63 & i) << 6 | 63 & a) > 2047 && (c < 55296 || c > 57343) && (_ = c);
                            break;
                        case 4:
                            i = e[o + 1], a = e[o + 2], s = e[o + 3], 128 == (192 & i) && 128 == (192 & a) && 128 == (192 & s) && (c = (15 & u) << 18 | (63 & i) << 12 | (63 & a) << 6 | 63 & s) > 65535 && c < 1114112 && (_ = c)
                    }
                }
                null === _ ? (_ = 65533, g = 1) : _ > 65535 && (_ -= 65536, r.push(_ >>> 10 & 1023 | 55296), _ = 56320 | 1023 & _), r.push(_), o += g
            }
            return function (e) {
                var t = e.length;
                if(t <= 4096) {
                    return String.fromCharCode.apply(String, e);
                }
                var n = "", r = 0;
                for (; r < t;) {
                    n += String.fromCharCode.apply(String, e.slice(r, r += 4096));
                }
                return n
            }(r)
        }

        t.Buffer = c, t.SlowBuffer = function (e) {
            +e != e && (e = 0);
            return c.alloc(+e)
        }, t.INSPECT_MAX_BYTES = 50,
            c.TYPED_ARRAY_SUPPORT = void 0 !==
                (e && e.TYPED_ARRAY_SUPPORT) ?
                e.TYPED_ARRAY_SUPPORT : function () {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype, foo: function () {
                        return 42
                    }
                }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
            } catch (e) {
                return !1
            }
        }(), t.kMaxLength = a(), c.poolSize = 8192, c._augment = function (e) {
            return e.__proto__ = c.prototype, e
        }, c.from = function (e, t, n) {
            return u(null, e, t, n)
        }, c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype, c.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
            value: null,
            configurable: !0
        })), c.alloc = function (e, t, n) {
            return function (e, t, n, r) {
                return _(t), t <= 0 ? s(e, t) : void 0 !== n ? "string" == typeof r ? s(e, t).fill(n, r) : s(e, t).fill(n) : s(e, t)
            }(null, e, t, n)
        }, c.allocUnsafe = function (e) {
            return g(null, e)
        }, c.allocUnsafeSlow = function (e) {
            return g(null, e)
        }, c.isBuffer = function (e) {
            return !(null == e || !e._isBuffer)
        }, c.compare = function (e, t) {
            if(!c.isBuffer(e) || !c.isBuffer(t)) {
                throw new TypeError("Arguments must be Buffers");
            }
            if(e === t) {
                return 0;
            }
            for (var n = e.length, r = t.length, o = 0, i = Math.min(n, r); o < i; ++o) {
                if(e[o] !== t[o]) {
                    n = e[o], r = t[o];
                    break
                }
            }
            return n < r ? -1 : r < n ? 1 : 0
        }, c.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
                case"hex":
                case"utf8":
                case"utf-8":
                case"ascii":
                case"latin1":
                case"binary":
                case"base64":
                case"ucs2":
                case"ucs-2":
                case"utf16le":
                case"utf-16le":
                    return !0;
                default:
                    return !1
            }
        }, c.concat = function (e, t) {
            if(!i(e)) {
                throw new TypeError('"list" argument must be an Array of Buffers');
            }
            if(0 === e.length) {
                return c.alloc(0);
            }
            var n;
            if(void 0 === t) {
                for (t = 0, n = 0; n < e.length; ++n) {
                    t += e[n].length;
                }
            }
            var r = c.allocUnsafe(t), o = 0;
            for (n = 0; n < e.length; ++n) {
                var a = e[n];
                if(!c.isBuffer(a)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                a.copy(r, o), o += a.length
            }
            return r
        }, c.byteLength = f, c.prototype._isBuffer = !0, c.prototype.swap16 = function () {
            var e = this.length;
            if(e % 2 != 0) {
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            }
            for (var t = 0; t < e; t += 2) {
                p(this, t, t + 1);
            }
            return this
        }, c.prototype.swap32 = function () {
            var e = this.length;
            if(e % 4 != 0) {
                throw new RangeError("Buffer size must be a multiple of 32-bits");
            }
            for (var t = 0; t < e; t += 4) {
                p(this, t, t + 3), p(this, t + 1, t + 2);
            }
            return this
        }, c.prototype.swap64 = function () {
            var e = this.length;
            if(e % 8 != 0) {
                throw new RangeError("Buffer size must be a multiple of 64-bits");
            }
            for (var t = 0; t < e; t += 8) {
                p(this, t, t + 7), p(this, t + 1, t + 6), p(this, t + 2, t + 5), p(this, t + 3, t + 4);
            }
            return this
        }, c.prototype.toString = function () {
            var e = 0 | this.length;
            return 0 === e ? "" : 0 === arguments.length ? x(this, 0, e) : b.apply(this, arguments)
        }, c.prototype.equals = function (e) {
            if(!c.isBuffer(e)) {
                throw new TypeError("Argument must be a Buffer");
            }
            return this === e || 0 === c.compare(this, e)
        }, c.prototype.inspect = function () {
            var e = "", n = t.INSPECT_MAX_BYTES;
            return this.length > 0 && (e = this.toString("hex", 0, n).match(/.{2}/g).join(" "), this.length > n && (e += " ... ")), "<Buffer " + e + ">"
        }, c.prototype.compare = function (e, t, n, r, o) {
            if(!c.isBuffer(e)) {
                throw new TypeError("Argument must be a Buffer");
            }
            if(void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === o && (o = this.length), t < 0 || n > e.length || r < 0 || o > this.length) {
                throw new RangeError("out of range index");
            }
            if(r >= o && t >= n) {
                return 0;
            }
            if(r >= o) {
                return -1;
            }
            if(t >= n) {
                return 1;
            }
            if(this === e) {
                return 0;
            }
            for (var i = (o >>>= 0) - (r >>>= 0), a = (n >>>= 0) - (t >>>= 0), s = Math.min(i, a), u = this.slice(r, o), _ = e.slice(t, n), g = 0; g < s; ++g) {
                if(u[g] !== _[g]) {
                    i = u[g], a = _[g];
                    break
                }
            }
            return i < a ? -1 : a < i ? 1 : 0
        }, c.prototype.includes = function (e, t, n) {
            return -1 !== this.indexOf(e, t, n)
        }, c.prototype.indexOf = function (e, t, n) {
            return h(this, e, t, n, !0)
        }, c.prototype.lastIndexOf = function (e, t, n) {
            return h(this, e, t, n, !1)
        }, c.prototype.write = function (e, t, n, r) {
            if(void 0 === t) {
                r = "utf8", n = this.length, t = 0;
            } else if(void 0 === n && "string" == typeof t) {
                r = t, n = this.length, t = 0;
            } else {
                if(!isFinite(t)) {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0)
            }
            var o = this.length - t;
            if((void 0 === n || n > o) && (n = o), e.length > 0 && (n < 0 || t < 0) || t > this.length) {
                throw new RangeError("Attempt to write outside buffer bounds");
            }
            r || (r = "utf8");
            for (var i = !1; ;) {
                switch (r) {
                    case"hex":
                        return m(this, e, t, n);
                    case"utf8":
                    case"utf-8":
                        return y(this, e, t, n);
                    case"ascii":
                        return v(this, e, t, n);
                    case"latin1":
                    case"binary":
                        return O(this, e, t, n);
                    case"base64":
                        return E(this, e, t, n);
                    case"ucs2":
                    case"ucs-2":
                    case"utf16le":
                    case"utf-16le":
                        return S(this, e, t, n);
                    default:
                        if(i) {
                            throw new TypeError("Unknown encoding: " + r);
                        }
                        r = ("" + r).toLowerCase(), i = !0
                }
            }
        }, c.prototype.toJSON = function () {
            return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
        };

        function j(e, t, n) {
            var r = "";
            n = Math.min(e.length, n);
            for (var o = t; o < n; ++o) {
                r += String.fromCharCode(127 & e[o]);
            }
            return r
        }

        function C(e, t, n) {
            var r = "";
            n = Math.min(e.length, n);
            for (var o = t; o < n; ++o) {
                r += String.fromCharCode(e[o]);
            }
            return r
        }

        function I(e, t, n) {
            var r = e.length;
            (!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);
            for (var o = "", i = t; i < n; ++i) {
                o += D(e[i]);
            }
            return o
        }

        function B(e, t, n) {
            for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) {
                o += String.fromCharCode(r[i] + 256 * r[i + 1]);
            }
            return o
        }

        function R(e, t, n) {
            if(e % 1 != 0 || e < 0) {
                throw new RangeError("offset is not uint");
            }
            if(e + t > n) {
                throw new RangeError("Trying to access beyond buffer length")
            }
        }

        function k(e, t, n, r, o, i) {
            if(!c.isBuffer(e)) {
                throw new TypeError('"buffer" argument must be a Buffer instance');
            }
            if(t > o || t < i) {
                throw new RangeError('"value" argument is out of bounds');
            }
            if(n + r > e.length) {
                throw new RangeError("Index out of range")
            }
        }

        function q(e, t, n, r) {
            t < 0 && (t = 65535 + t + 1);
            for (var o = 0, i = Math.min(e.length - n, 2); o < i; ++o) {
                e[n + o] = (t & 255 << 8 * (r ? o : 1 - o)) >>> 8 * (r ? o : 1 - o)
            }
        }

        function M(e, t, n, r) {
            t < 0 && (t = 4294967295 + t + 1);
            for (var o = 0, i = Math.min(e.length - n, 4); o < i; ++o) {
                e[n + o] = t >>> 8 * (r ? o : 3 - o) & 255
            }
        }

        function F(e, t, n, r, o, i) {
            if(n + r > e.length) {
                throw new RangeError("Index out of range");
            }
            if(n < 0) {
                throw new RangeError("Index out of range")
            }
        }

        function T(e, t, n, r, i) {
            return i || F(e, 0, n, 4), o.write(e, t, n, r, 23, 4), n + 4
        }

        function P(e, t, n, r, i) {
            return i || F(e, 0, n, 8), o.write(e, t, n, r, 52, 8), n + 8
        }

        c.prototype.slice = function (e, t) {
            var n, r = this.length;
            if((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), c.TYPED_ARRAY_SUPPORT) {
                (n = this.subarray(e, t)).__proto__ = c.prototype;
            } else {
                var o = t - e;
                n = new c(o, void 0);
                for (var i = 0; i < o; ++i) {
                    n[i] = this[i + e]
                }
            }
            return n
        }, c.prototype.readUIntLE = function (e, t, n) {
            e |= 0, t |= 0, n || R(e, t, this.length);
            for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {
                r += this[e + i] * o;
            }
            return r
        }, c.prototype.readUIntBE = function (e, t, n) {
            e |= 0, t |= 0, n || R(e, t, this.length);
            for (var r = this[e + --t], o = 1; t > 0 && (o *= 256);) {
                r += this[e + --t] * o;
            }
            return r
        }, c.prototype.readUInt8 = function (e, t) {
            return t || R(e, 1, this.length), this[e]
        }, c.prototype.readUInt16LE = function (e, t) {
            return t || R(e, 2, this.length), this[e] | this[e + 1] << 8
        }, c.prototype.readUInt16BE = function (e, t) {
            return t || R(e, 2, this.length), this[e] << 8 | this[e + 1]
        }, c.prototype.readUInt32LE = function (e, t) {
            return t || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }, c.prototype.readUInt32BE = function (e, t) {
            return t || R(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }, c.prototype.readIntLE = function (e, t, n) {
            e |= 0, t |= 0, n || R(e, t, this.length);
            for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {
                r += this[e + i] * o;
            }
            return r >= (o *= 128) && (r -= Math.pow(2, 8 * t)), r
        }, c.prototype.readIntBE = function (e, t, n) {
            e |= 0, t |= 0, n || R(e, t, this.length);
            for (var r = t, o = 1, i = this[e + --r]; r > 0 && (o *= 256);) {
                i += this[e + --r] * o;
            }
            return i >= (o *= 128) && (i -= Math.pow(2, 8 * t)), i
        }, c.prototype.readInt8 = function (e, t) {
            return t || R(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }, c.prototype.readInt16LE = function (e, t) {
            t || R(e, 2, this.length);
            var n = this[e] | this[e + 1] << 8;
            return 32768 & n ? 4294901760 | n : n
        }, c.prototype.readInt16BE = function (e, t) {
            t || R(e, 2, this.length);
            var n = this[e + 1] | this[e] << 8;
            return 32768 & n ? 4294901760 | n : n
        }, c.prototype.readInt32LE = function (e, t) {
            return t || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }, c.prototype.readInt32BE = function (e, t) {
            return t || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }, c.prototype.readFloatLE = function (e, t) {
            return t || R(e, 4, this.length), o.read(this, e, !0, 23, 4)
        }, c.prototype.readFloatBE = function (e, t) {
            return t || R(e, 4, this.length), o.read(this, e, !1, 23, 4)
        }, c.prototype.readDoubleLE = function (e, t) {
            return t || R(e, 8, this.length), o.read(this, e, !0, 52, 8)
        }, c.prototype.readDoubleBE = function (e, t) {
            return t || R(e, 8, this.length), o.read(this, e, !1, 52, 8)
        }, c.prototype.writeUIntLE = function (e, t, n, r) {
            (e = +e, t |= 0, n |= 0, r) || k(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
            var o = 1, i = 0;
            for (this[t] = 255 & e; ++i < n && (o *= 256);) {
                this[t + i] = e / o & 255;
            }
            return t + n
        }, c.prototype.writeUIntBE = function (e, t, n, r) {
            (e = +e, t |= 0, n |= 0, r) || k(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
            var o = n - 1, i = 1;
            for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) {
                this[t + o] = e / i & 255;
            }
            return t + n
        }, c.prototype.writeUInt8 = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 1, 255, 0), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
        }, c.prototype.writeUInt16LE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : q(this, e, t, !0), t + 2
        }, c.prototype.writeUInt16BE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : q(this, e, t, !1), t + 2
        }, c.prototype.writeUInt32LE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : M(this, e, t, !0), t + 4
        }, c.prototype.writeUInt32BE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : M(this, e, t, !1), t + 4
        }, c.prototype.writeIntLE = function (e, t, n, r) {
            if(e = +e, t |= 0, !r) {
                var o = Math.pow(2, 8 * n - 1);
                k(this, e, t, n, o - 1, -o)
            }
            var i = 0, a = 1, s = 0;
            for (this[t] = 255 & e; ++i < n && (a *= 256);) {
                e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1), this[t + i] = (e / a >> 0) - s & 255;
            }
            return t + n
        }, c.prototype.writeIntBE = function (e, t, n, r) {
            if(e = +e, t |= 0, !r) {
                var o = Math.pow(2, 8 * n - 1);
                k(this, e, t, n, o - 1, -o)
            }
            var i = n - 1, a = 1, s = 0;
            for (this[t + i] = 255 & e; --i >= 0 && (a *= 256);) {
                e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1), this[t + i] = (e / a >> 0) - s & 255;
            }
            return t + n
        }, c.prototype.writeInt8 = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 1, 127, -128), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
        }, c.prototype.writeInt16LE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : q(this, e, t, !0), t + 2
        }, c.prototype.writeInt16BE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : q(this, e, t, !1), t + 2
        }, c.prototype.writeInt32LE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 4, 2147483647, -2147483648), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : M(this, e, t, !0), t + 4
        }, c.prototype.writeInt32BE = function (e, t, n) {
            return e = +e, t |= 0, n || k(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : M(this, e, t, !1), t + 4
        }, c.prototype.writeFloatLE = function (e, t, n) {
            return T(this, e, t, !0, n)
        }, c.prototype.writeFloatBE = function (e, t, n) {
            return T(this, e, t, !1, n)
        }, c.prototype.writeDoubleLE = function (e, t, n) {
            return P(this, e, t, !0, n)
        }, c.prototype.writeDoubleBE = function (e, t, n) {
            return P(this, e, t, !1, n)
        }, c.prototype.copy = function (e, t, n, r) {
            if(n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) {
                return 0;
            }
            if(0 === e.length || 0 === this.length) {
                return 0;
            }
            if(t < 0) {
                throw new RangeError("targetStart out of bounds");
            }
            if(n < 0 || n >= this.length) {
                throw new RangeError("sourceStart out of bounds");
            }
            if(r < 0) {
                throw new RangeError("sourceEnd out of bounds");
            }
            r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
            var o, i = r - n;
            if(this === e && n < t && t < r) {
                for (o = i - 1; o >= 0; --o) {
                    e[o + t] = this[o + n];
                }
            } else if(i < 1e3 || !c.TYPED_ARRAY_SUPPORT) {
                for (o = 0; o < i; ++o) {
                    e[o + t] = this[o + n];
                }
            } else {
                Uint8Array.prototype.set.call(e, this.subarray(n, n + i), t);
            }
            return i
        }, c.prototype.fill = function (e, t, n, r) {
            if("string" == typeof e) {
                if("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
                    var o = e.charCodeAt(0);
                    o < 256 && (e = o)
                }
                if(void 0 !== r && "string" != typeof r) {
                    throw new TypeError("encoding must be a string");
                }
                if("string" == typeof r && !c.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r)
                }
            } else {
                "number" == typeof e && (e &= 255);
            }
            if(t < 0 || this.length < t || this.length < n) {
                throw new RangeError("Out of range index");
            }
            if(n <= t) {
                return this;
            }
            var i;
            if(t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e) {
                for (i = t; i < n; ++i) {
                    this[i] = e;
                }
            } else {
                var a = c.isBuffer(e) ? e : H(new c(e, r).toString()), s = a.length;
                for (i = 0; i < n - t; ++i) {
                    this[i + t] = a[i % s]
                }
            }
            return this
        };
        var N = /[^+\/0-9A-Za-z-_]/g;

        function D(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
        }

        function H(e, t) {
            var n;
            t = t || 1 / 0;
            for (var r = e.length, o = null, i = [], a = 0; a < r; ++a) {
                if((n = e.charCodeAt(a)) > 55295 && n < 57344) {
                    if(!o) {
                        if(n > 56319) {
                            (t -= 3) > -1 && i.push(239, 191, 189);
                            continue
                        }
                        if(a + 1 === r) {
                            (t -= 3) > -1 && i.push(239, 191, 189);
                            continue
                        }
                        o = n;
                        continue
                    }
                    if(n < 56320) {
                        (t -= 3) > -1 && i.push(239, 191, 189), o = n;
                        continue
                    }
                    n = 65536 + (o - 55296 << 10 | n - 56320)
                } else {
                    o && (t -= 3) > -1 && i.push(239, 191, 189);
                }
                if(o = null, n < 128) {
                    if((t -= 1) < 0) {
                        break;
                    }
                    i.push(n)
                } else if(n < 2048) {
                    if((t -= 2) < 0) {
                        break;
                    }
                    i.push(n >> 6 | 192, 63 & n | 128)
                } else if(n < 65536) {
                    if((t -= 3) < 0) {
                        break;
                    }
                    i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                } else {
                    if(!(n < 1114112)) {
                        throw new Error("Invalid code point");
                    }
                    if((t -= 4) < 0) {
                        break;
                    }
                    i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                }
            }
            return i
        }

        function W(e) {
            return r.toByteArray(function (e) {
                if((e = function (e) {
                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                }(e).replace(N, "")).length < 2) {
                    return "";
                }
                for (; e.length % 4 != 0;) {
                    e += "=";
                }
                return e
            }(e))
        }

        function U(e, t, n, r) {
            for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); ++o) {
                t[o + n] = e[o];
            }
            return o
        }
    }).call(this, n(1))
}, function (e, t, n) {
    "use strict";
    t.byteLength = function (e) {
        var t = u(e), n = t[0], r = t[1];
        return 3 * (n + r) / 4 - r
    }, t.toByteArray = function (e) {
        var t, n, r = u(e), a = r[0], s = r[1], c = new i(function (e, t, n) {
            return 3 * (t + n) / 4 - n
        }(0, a, s)), _ = 0, g = s > 0 ? a - 4 : a;
        for (n = 0; n < g; n += 4) {
            t = o[e.charCodeAt(n)] << 18 | o[e.charCodeAt(n + 1)] << 12 | o[e.charCodeAt(n + 2)] << 6 | o[e.charCodeAt(n + 3)], c[_++] = t >> 16 & 255, c[_++] = t >> 8 & 255, c[_++] = 255 & t;
        }
        2 === s && (t = o[e.charCodeAt(n)] << 2 | o[e.charCodeAt(n + 1)] >> 4, c[_++] = 255 & t);
        1 === s && (t = o[e.charCodeAt(n)] << 10 | o[e.charCodeAt(n + 1)] << 4 | o[e.charCodeAt(n + 2)] >> 2, c[_++] = t >> 8 & 255, c[_++] = 255 & t);
        return c
    }, t.fromByteArray = function (e) {
        for (var t, n = e.length, o = n % 3, i = [], a = 0, s = n - o; a < s; a += 16383) {
            i.push(_(e, a, a + 16383 > s ? s : a + 16383));
        }
        1 === o ? (t = e[n - 1], i.push(r[t >> 2] + r[t << 4 & 63] + "==")) : 2 === o && (t = (e[n - 2] << 8) + e[n - 1], i.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "="));
        return i.join("")
    };
    for (var r = [], o = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, c = a.length; s < c; ++s) {
        r[s] = a[s], o[a.charCodeAt(s)] = s;
    }

    function u(e) {
        var t = e.length;
        if(t % 4 > 0) {
            throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var n = e.indexOf("=");
        return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4]
    }

    function _(e, t, n) {
        for (var o, i, a = [], s = t; s < n; s += 3) {
            o = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2]), a.push(r[(i = o) >> 18 & 63] + r[i >> 12 & 63] + r[i >> 6 & 63] + r[63 & i]);
        }
        return a.join("")
    }

    o["-".charCodeAt(0)] = 62, o["_".charCodeAt(0)] = 63
}, function (e, t) {
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    t.read = function (e, t, n, r, o) {
        var i, a, s = 8 * o - r - 1, c = (1 << s) - 1, u = c >> 1, _ = -7, g = n ? o - 1 : 0, d = n ? -1 : 1,
            l = e[t + g];
        for (g += d, i = l & (1 << -_) - 1, l >>= -_, _ += s; _ > 0; i = 256 * i + e[t + g], g += d, _ -= 8) {
            ;
        }
        for (a = i & (1 << -_) - 1, i >>= -_, _ += r; _ > 0; a = 256 * a + e[t + g], g += d, _ -= 8) {
            ;
        }
        if(0 === i) {
            i = 1 - u;
        } else {
            if(i === c) {
                return a ? NaN : 1 / 0 * (l ? -1 : 1);
            }
            a += Math.pow(2, r), i -= u
        }
        return (l ? -1 : 1) * a * Math.pow(2, i - r)
    }, t.write = function (e, t, n, r, o, i) {
        var a, s, c, u = 8 * i - o - 1, _ = (1 << u) - 1, g = _ >> 1,
            d = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = r ? 0 : i - 1, f = r ? 1 : -1,
            b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
        for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = _) : (a = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -a)) < 1 && (a--, c *= 2), (t += a + g >= 1 ? d / c : d * Math.pow(2, 1 - g)) * c >= 2 && (a++, c /= 2), a + g >= _ ? (s = 0, a = _) : a + g >= 1 ? (s = (t * c - 1) * Math.pow(2, o), a += g) : (s = t * Math.pow(2, g - 1) * Math.pow(2, o), a = 0)); o >= 8; e[n + l] = 255 & s, l += f, s /= 256, o -= 8) {
            ;
        }
        for (a = a << o | s, u += o; u > 0; e[n + l] = 255 & a, l += f, a /= 256, u -= 8) {
            ;
        }
        e[n + l - f] |= 128 * b
    }
}, function (e, t) {
    var n = {}.toString;
    e.exports = Array.isArray || function (e) {
        return "[object Array]" == n.call(e)
    }
}, function (e, t, n) {
    "use strict";
    var r = this && this.__awaiter || function (e, t, n, r) {
        return new (n || (n = Promise))((function (o, i) {
            function a(e) {
                try {
                    c(r.next(e))
                } catch (e) {
                    i(e)
                }
            }

            function s(e) {
                try {
                    c(r.throw(e))
                } catch (e) {
                    i(e)
                }
            }

            function c(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                    e(t)
                }))).then(a, s)
            }

            c((r = r.apply(e, t || [])).next())
        }))
    };
    Object.defineProperty(t, "__esModule", {value: !0}), t.TonClient = void 0;
    const o = n(2), i = n(10);

    class a {
        constructor(e) {
            this.context = void 0, this.contextCreation = void 0, this.contextError = void 0, this.config = null != e ? e : {}, this.client = new o.ClientModule(this), this.crypto = new o.CryptoModule(this), this.abi = new o.AbiModule(this), this.boc = new o.BocModule(this), this.processing = new o.ProcessingModule(this), this.utils = new o.UtilsModule(this), this.net = new o.NetModule(this), this.tvm = new o.TvmModule(this), this.proofs = new o.ProofsModule(this)
        }

        static set default(e) {
            this._default = e
        }

        static get default() {
            return null === this._default && (this._default = new a(this._defaultConfig)), this._default
        }

        static set defaultConfig(e) {
            this._defaultConfig = e
        }

        static get defaultConfig() {
            return this._defaultConfig
        }

        static useBinaryLibrary(e) {
            (0, i.useLibrary)(e)
        }

        static toKey(e) {
            return s(e, 256)
        }

        static toHash64(e) {
            return s(e, 64)
        }

        static toHash128(e) {
            return s(e, 128)
        }

        static toHash256(e) {
            return s(e, 256)
        }

        static toHash512(e) {
            return s(e, 512)
        }

        static toHex(e, t = 0) {
            return s(e, t)
        }

        close() {
            const e = this.context;
            void 0 !== e && (this.context = void 0, (0, i.getBridge)().destroyContext(e))
        }

        resolveError(e, t, n) {
            var o, i;
            return r(this, void 0, void 0, (function* () {
                if(23 !== n.code || !(null === (o = n.data) || void 0 === o ? void 0 : o.suggest_use_helper_for)) {
                    return n;
                }
                try {
                    const [r, o] = e.split("."), i = (yield this.client.get_api_reference()).api,
                        a = i.modules.reduce((e, t) => e.concat(t.types), []), s = {};
                    a.forEach(e => s[e.name] = e);
                    const c = i.modules.find(e => e.name === r), u = c.functions.find(e => e.name === o).params[1];
                    if(!u || "AppObject" == u.generic_name) {
                        return n;
                    }
                    !function e(t, r, o) {
                        switch (t.type) {
                            case"Array":
                                Array.isArray(r) && r.forEach(n => e(t.array_item, n, o + "[i]"));
                                break;
                            case"Struct":
                                t.struct_fields.forEach(t => e(t, r[t.name], o ? `${o}.${t.name}` : t.name));
                                break;
                            case"Optional":
                                r && e(t.optional_inner, r, o);
                                break;
                            case"Ref":
                                "Value" != t.ref_name && "API" != t.ref_name && "AbiParam" != t.ref_name && e(s[t.ref_name], r, o);
                                break;
                            case"EnumOfTypes":
                                if(t.enum_types.some(e => e.name == r.type)) {
                                    return;
                                }
                                let i = t.name.toLowerCase(), a = [];
                                t.enum_types.forEach(e => a.push(i + e.name)), n.message = `Consider using one of the helper methods (${a.join(", ")}) for the "${o}" parameter\n` + n.message
                        }
                    }(s[u.ref_name], t, "")
                } catch (e) {
                    n.message = null !== (i = e.message) && void 0 !== i ? i : "" + e
                }
                return n
            }))
        }

        contextRequired() {
            return void 0 !== this.context ? Promise.resolve(this.context) : void 0 !== this.contextError ? Promise.reject(this.contextError) : (void 0 === this.contextCreation && (this.contextCreation = [], (0, i.getBridge)().createContext(this.config).then(e => {
                const t = this.contextCreation;
                this.contextCreation = void 0, this.context = e, null == t || t.forEach(t => t.resolve(e))
            }, e => {
                const t = this.contextCreation;
                this.contextCreation = void 0, this.contextError = null != e ? e : void 0, null == t || t.forEach(t => t.reject(e))
            })), new Promise((e, t) => {
                var n;
                null === (n = this.contextCreation) || void 0 === n || n.push({resolve: e, reject: t})
            }))
        }

        request(e, t, n) {
            var o;
            return r(this, void 0, void 0, (function* () {
                const a = null !== (o = this.context) && void 0 !== o ? o : yield this.contextRequired();
                return (0, i.getBridge)().request(a, e, t, null != n ? n : () => {
                }).catch(n => r(this, void 0, void 0, (function* () {
                    throw yield this.resolveError(e, t, n)
                })))
            }))
        }

        resolve_app_request(e, t) {
            return r(this, void 0, void 0, (function* () {
                e && (yield this.client.resolve_app_request({app_request_id: e, result: {type: "Ok", result: t}}))
            }))
        }

        reject_app_request(e, t) {
            return r(this, void 0, void 0, (function* () {
                e && (yield this.client.resolve_app_request({
                    app_request_id: e,
                    result: {type: "Error", text: t.message}
                }))
            }))
        }
    }

    function s(e, t) {
        let n;
        n = "number" == typeof e || "bigint" == typeof e ? e.toString(16) : "string" == typeof e ? e.startsWith("0x") ? e.substring(2) : function (e) {
            var t;
            let n = [];
            for (let r = 0; r < e.length; r += 1) {
                const o = (null !== (t = e.codePointAt(r)) && void 0 !== t ? t : 0) - 48, i = c(n, 3), a = c(n, 1),
                    s = u(i, a);
                n = u(s, [o])
            }
            let r = "";
            for (let e = n.length - 1; e >= 0; e -= 1) {
                r += n[e].toString(16).padStart(4, "0");
            }
            return r
        }(e) : e.toString();
        let r = t / 4;
        for (; n.length > r && n.startsWith("0");) {
            n = n.substring(1);
        }
        return n.padStart(r, "0")
    }

    function c(e, t) {
        let n = 0;
        const r = [];
        for (let o = 0; o < e.length; o += 1) {
            let i = (e[o] << t) + n;
            r.push(65535 & i), n = i >> 16 & 65535
        }
        return n > 0 && r.push(n), r
    }

    function u(e, t) {
        let n = 0;
        const r = [], o = Math.max(e.length, t.length);
        for (let i = 0; i < o; i += 1) {
            let o = (i < e.length ? e[i] : 0) + (i < t.length ? t[i] : 0) + n;
            r.push(65535 & o), n = o >> 16 & 65535
        }
        return n > 0 && r.push(n), r
    }

    t.TonClient = a, a._defaultConfig = {}, a._default = null
}, function (e, t, n) {
    "use strict";
    var r = this && this.__awaiter || function (e, t, n, r) {
        return new (n || (n = Promise))((function (o, i) {
            function a(e) {
                try {
                    c(r.next(e))
                } catch (e) {
                    i(e)
                }
            }

            function s(e) {
                try {
                    c(r.throw(e))
                } catch (e) {
                    i(e)
                }
            }

            function c(e) {
                var t;
                e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                    e(t)
                }))).then(a, s)
            }

            c((r = r.apply(e, t || [])).next())
        }))
    };
    Object.defineProperty(t, "__esModule", {value: !0}), t.CommonBinaryBridge = t.useLibrary = t.getBridge = t.ResponseType = void 0;
    const o = n(11);
    var i;
    !function (e) {
        e[e.Success = 0] = "Success", e[e.Error = 1] = "Error", e[e.Nop = 2] = "Nop", e[e.AppRequest = 3] = "AppRequest", e[e.AppNotify = 4] = "AppNotify", e[e.Custom = 100] = "Custom"
    }(i = t.ResponseType || (t.ResponseType = {}));
    let a = void 0;
    t.getBridge = function () {
        if(!a) {
            throw new o.TonClientError(1, "TON Client binary bridge isn't set.");
        }
        return a
    }, t.useLibrary = function (e) {
        a = "createContext" in e ? e : new c(e)
    };

    class s {
        constructor(e) {
            this.library = e
        }

        setResponseParamsHandler(e) {
            void 0 === e ? this.library.setResponseHandler(void 0) : this.library.setResponseHandler((t, n, r, o) => e(t, "" !== n ? JSON.parse(n) : void 0, r, o))
        }

        sendRequestParams(e, t, n, r) {
            const o = null == r ? "" : JSON.stringify(r, (e, t) => "bigint" == typeof t ? t < Number.MAX_SAFE_INTEGER && t > Number.MIN_SAFE_INTEGER ? Number(t) : t.toString() : t);
            this.library.sendRequest(e, t, n, o)
        }

        createContext(e) {
            return this.library.createContext(e)
        }

        destroyContext(e) {
            this.library.destroyContext(e)
        }
    }

    class c {
        constructor(e) {
            this.loading = void 0, this.loadError = void 0, this.library = void 0, this.requests = new Map, this.nextRequestId = 1, this.contextCount = 0, this.responseHandlerAssigned = !1, this.loading = [], e().then(e => {
                const t = this.loading;
                this.loading = void 0;
                let n = "setResponseParamsHandler" in e ? e : new s(e);
                this.library = n, null == t || t.forEach(e => e.resolve(n))
            }, e => {
                const t = this.loading;
                this.loading = void 0, this.loadError = null != e ? e : void 0, null == t || t.forEach(t => t.reject(e))
            })
        }

        checkResponseHandler() {
            var e, t;
            const n = this.contextCount > 0 || this.requests.size > 0;
            this.responseHandlerAssigned !== n && (n ? null === (e = this.library) || void 0 === e || e.setResponseParamsHandler((e, t, n, r) => this.handleLibraryResponse(e, t, n, r)) : null === (t = this.library) || void 0 === t || t.setResponseParamsHandler(), this.responseHandlerAssigned = n)
        }

        createContext(e) {
            return r(this, void 0, void 0, (function* () {
                const t = this.library || (yield this.loadRequired());
                return this.contextCount += 1, c.parseResult(yield t.createContext(JSON.stringify(e)))
            }))
        }

        destroyContext(e) {
            var t;
            this.contextCount = Math.max(this.contextCount - 1, 0), this.checkResponseHandler(), null === (t = this.library) || void 0 === t || t.destroyContext(e)
        }

        request(e, t, n, o) {
            var i;
            return r(this, void 0, void 0, (function* () {
                const r = null !== (i = this.library) && void 0 !== i ? i : yield this.loadRequired();
                return new Promise((i, a) => {
                    const s = {resolve: i, reject: a, responseHandler: o}, c = this.generateRequestId();
                    this.requests.set(c, s), this.checkResponseHandler(), r.sendRequestParams(e, c, t, n)
                })
            }))
        }

        loadRequired() {
            return void 0 !== this.library ? Promise.resolve(this.library) : void 0 !== this.loadError ? Promise.reject(this.loadError) : void 0 === this.loading ? Promise.reject(new o.TonClientError(1, "TON Client binary library isn't set.")) : new Promise((e, t) => {
                var n;
                null === (n = this.loading) || void 0 === n || n.push({resolve: e, reject: t})
            })
        }

        generateRequestId() {
            const e = this.nextRequestId;
            do {
                this.nextRequestId += 1, this.nextRequestId >= Number.MAX_SAFE_INTEGER && (this.nextRequestId = 1)
            } while (this.requests.has(this.nextRequestId));
            return e
        }

        handleLibraryResponse(e, t, n, r) {
            const o = this.requests.get(e);
            if(o) {
                switch (r && (this.requests.delete(e), this.checkResponseHandler()), n) {
                    case i.Success:
                        o.resolve(t);
                        break;
                    case i.Error:
                        o.reject(t);
                        break;
                    default:
                        (n === i.AppNotify || n === i.AppRequest || n >= i.Custom) && o.responseHandler && o.responseHandler(t, n)
                }
            }
        }

        static parseResult(e) {
            const t = JSON.parse(e);
            if("error" in t) {
                throw new o.TonClientError(t.error.code, t.error.message, t.error.data);
            }
            return t.result
        }
    }

    t.CommonBinaryBridge = c
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0}), t.TonClientError = void 0;

    class r extends Error {
        constructor(e, t, n) {
            super(t), this.code = e, this.data = n
        }
    }

    t.TonClientError = r
}, function (e, t) {
    e.exports = function (e) {
        if(!e.webpackPolyfill) {
            var t = Object.create(e);
            t.children || (t.children = []), Object.defineProperty(t, "loaded", {
                enumerable: !0, get: function () {
                    return t.l
                }
            }), Object.defineProperty(t, "id", {
                enumerable: !0, get: function () {
                    return t.i
                }
            }), Object.defineProperty(t, "exports", {enumerable: !0}), t.webpackPolyfill = 1
        }
        return t
    }
}]);
//# sourceMappingURL=main.js.map