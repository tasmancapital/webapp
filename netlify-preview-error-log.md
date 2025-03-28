
10:07:38 AM:
10:07:38 AM: Starting Stackbit service
10:07:38 AM: ─────────────────────────────────
10:07:38 AM: [info] Container v0.5.4 (common: v1.0.39, core: v3.1.20)
10:07:38 AM: [info] Stackbit service running on node v18.20.6
10:07:38 AM:
10:07:38 AM: Cloning repository
10:07:38 AM: ──────────────────────────
10:07:38 AM: [info] Cloning repository from 'git@github.com:tasmancapital/webapp.git'...
10:07:39 AM: [info] Checking out branch 'preview'...
10:07:39 AM: [info] ✅ Done
10:07:39 AM:
10:07:39 AM: Setting up environment
10:07:39 AM: ──────────────────────────────
10:07:39 AM: [info] Container running from /home/appuser/app
10:07:40 AM: [info] Using Node v10.23.0. To use a different version, specify 'nodeVersion' in stackbit config.
10:07:40 AM: [info] ✅ Done
10:07:40 AM:
10:07:40 AM: Installing dependencies
10:07:40 AM: ───────────────────────────────
10:07:40 AM: [info] Installing dependencies using npm: 'npm install --no-audit --prefer-offline --no-save --color=always'
10:07:40 AM: [debug] [npm-install]: installing under node version: v10.23.0
10:07:41 AM: [debug] [npm-install]: npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@3. I'll try to do my best with it!
10:07:47 AM: [debug] [npm-install]: npm WARN deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
10:07:58 AM: [debug] [npm-install]: npm WARN deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
10:08:00 AM: [debug] [npm-install]: npm WARN deprecated yurnalist@2.1.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
10:08:00 AM: [debug] [npm-install]: npm WARN deprecated lodash.get@4.4.2: This package is deprecated. Use the optional chaining (?.) operator instead.
10:08:00 AM: [debug] [npm-install]: npm WARN deprecated lodash.pick@4.4.0: This package is deprecated. Use destructuring assignment syntax instead.
10:08:01 AM: [debug] [npm-install]: npm WARN deprecated lodash.isequal@4.5.0: This package is deprecated. Use require('node:util').isDeepStrictEqual instead.
10:08:01 AM: [debug] [npm-install]: npm WARN deprecated string-similarity@1.2.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
10:08:01 AM: [debug] [npm-install]: npm WARN deprecated lodash.omit@4.5.0: This package is deprecated. Use destructuring assignment syntax instead.
10:08:04 AM: [debug] [npm-install]: npm WARN deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
10:08:04 AM: [debug] [npm-install]: npm WARN deprecated sudo-prompt@8.2.5: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
10:08:40 AM: [debug] [npm-install]: > msgpackr-extract@3.0.3 install /home/appuser/app/node_modules/msgpackr-extract
10:08:40 AM: [debug] [npm-install]: > node-gyp-build-optional-packages
10:08:40 AM: [debug] [npm-install]: /home/appuser/app/node_modules/msgpackr-extract/node_modules/node-gyp-build-optional-packages/node-gyp-build.js:85
10:08:40 AM: [debug] [npm-install]: throw new Error(errMessage)
10:08:40 AM: [debug] [npm-install]: ^
10:08:40 AM: [debug] [npm-install]: Error: No native build was found for platform=linux arch=x64 runtime=node abi=64 uv=1 libc=glibc node=10.23.0
10:08:40 AM: [debug] [npm-install]: attempted loading from: /home/appuser/app/node_modules/msgpackr-extract and package: @msgpackr-extract/msgpackr-extract-linux-x64
10:08:40 AM: [debug] [npm-install]: Error resolving package: require(...).createRequire is not a function
10:08:40 AM: [debug] [npm-install]: at Function.load.resolve.load.path (/home/appuser/app/node_modules/msgpackr-extract/node_modules/node-gyp-build-optional-packages/node-gyp-build.js:85:9)
10:08:40 AM: [debug] [npm-install]: at load (/home/appuser/app/node_modules/msgpackr-extract/node_modules/node-gyp-build-optional-packages/node-gyp-build.js:28:30)
10:08:40 AM: [debug] [npm-install]: at Object. (/home/appuser/app/node_modules/msgpackr-extract/node_modules/node-gyp-build-optional-packages/build-test.js:19:19)
10:08:40 AM: [debug] [npm-install]: at Module._compile (internal/modules/cjs/loader.js:778:30)
10:08:40 AM: [debug] [npm-install]: at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
10:08:40 AM: [debug] [npm-install]: at Module.load (internal/modules/cjs/loader.js:653:32)
10:08:40 AM: [debug] [npm-install]: at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
10:08:40 AM: [debug] [npm-install]: at Function.Module._load (internal/modules/cjs/loader.js:585:3)
10:08:40 AM: [debug] [npm-install]: at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)
10:08:40 AM: [debug] [npm-install]: at startup (internal/bootstrap/node.js:283:19)
10:08:40 AM: [debug] [npm-install]: The failure above indicates the primary issue with the native builds which are included for all major platforms. Will now attempt to build the package locally in case this can be resolved by re-compiling.
10:08:44 AM: [debug] [npm-install]: make: Entering directory '/home/appuser/app/node_modules/msgpackr-extract/build'
10:08:44 AM: [debug] [npm-install]: CXX(target) Release/obj.target/extract/src/extract.o
10:08:45 AM: [debug] [npm-install]: ../src/extract.cpp: In member function 'napi_value__* Extractor::extractStrings(napi_env, uint32_t, uint32_t, uint8_t*)':
10:08:45 AM: [debug] [npm-install]: ../src/extract.cpp:166:121: error: no matching function for call to 'v8::Array::New(v8::Isolate*, v8::Local*, uint32_t&)'
10:08:45 AM: [debug] [npm-install]: 166 | v8::Local v8Array = v8::Array::New(v8::Isolate::GetCurrent(), (v8::Local*) target, writePosition);
10:08:45 AM: [debug] [npm-install]: | ^
10:08:45 AM: [debug] [npm-install]: In file included from ../src/extract.cpp:10:
10:08:45 AM: [debug] [npm-install]: /home/appuser/.cache/node-gyp/10.23.0/include/node/v8.h:3674:23: note: candidate: 'static v8::Local v8::Array::New(v8::Isolate*, int)'
10:08:45 AM: [debug] [npm-install]: 3674 | static Local New(Isolate* isolate, int length = 0);
10:08:45 AM: [debug] [npm-install]: | ^~~
10:08:45 AM: [debug] [npm-install]: /home/appuser/.cache/node-gyp/10.23.0/include/node/v8.h:3674:23: note: candidate expects 2 arguments, 3 provided
10:08:45 AM: [debug] [npm-install]: ../src/extract.cpp:167:3: error: 'memcpy' was not declared in this scope
10:08:45 AM: [debug] [npm-install]: 167 | memcpy(&array, &v8Array, sizeof(array));
10:08:45 AM: [debug] [npm-install]: | ^~~~~~
10:08:45 AM: [debug] [npm-install]: ../src/extract.cpp:11:1: note: 'memcpy' is defined in header ''; did you forget to '#include '?
10:08:45 AM: [debug] [npm-install]: 10 | #include
10:08:45 AM: [debug] [npm-install]: +++ |+#include
10:08:45 AM: [debug] [npm-install]: 11 | #endif
10:08:45 AM: [debug] [npm-install]: make: *** [extract.target.mk:119: Release/obj.target/extract/src/extract.o] Error 1
10:08:45 AM: [debug] [npm-install]: make: Leaving directory '/home/appuser/app/node_modules/msgpackr-extract/build'
10:08:45 AM: [debug] [npm-install]: gyp ERR! build error
10:08:45 AM: [debug] [npm-install]: gyp ERR! stack Error: `make` failed with exit code: 2
10:08:45 AM: [debug] [npm-install]: gyp ERR! stack at ChildProcess.onExit (/home/appuser/.nvm/versions/node/v10.23.0/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:191:23)
10:08:45 AM: [debug] [npm-install]: gyp ERR! stack at ChildProcess.emit (events.js:198:13)
10:08:45 AM: [debug] [npm-install]: gyp ERR! stack at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
10:08:45 AM: [debug] [npm-install]: gyp ERR! System Linux 4.14.349-266.564.amzn2.x86_64
10:08:45 AM: [debug] [npm-install]: gyp ERR! command "/home/appuser/.nvm/versions/node/v10.23.0/bin/node" "/home/appuser/.nvm/versions/node/v10.23.0/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
10:08:45 AM: [debug] [npm-install]: gyp ERR! cwd /home/appuser/app/node_modules/msgpackr-extract
10:08:45 AM: [debug] [npm-install]: gyp ERR! node -v v10.23.0
10:08:45 AM: [debug] [npm-install]: gyp ERR! node-gyp -v v5.1.0
10:08:45 AM: [debug] [npm-install]: gyp ERR! not ok
10:08:45 AM: [debug] [npm-install]: > lmdb@2.5.3 install /home/appuser/app/node_modules/lmdb
10:08:45 AM: [debug] [npm-install]: > node-gyp-build-optional-packages
10:08:45 AM: [debug] [npm-install]: make: Entering directory '/home/appuser/app/node_modules/lmdb/build'
10:08:45 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/lmdb-js.o
10:08:47 AM: [debug] [npm-install]: CC(target) Release/obj.target/lmdb/dependencies/lmdb/libraries/liblmdb/midl.o
10:08:47 AM: [debug] [npm-install]: CC(target) Release/obj.target/lmdb/dependencies/lmdb/libraries/liblmdb/chacha8.o
10:08:47 AM: [debug] [npm-install]: CC(target) Release/obj.target/lmdb/dependencies/lz4/lib/lz4.o
10:08:50 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/writer.o
10:08:52 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/env.o
10:08:54 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/compression.o
10:08:56 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/ordered-binary.o
10:08:57 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/misc.o
10:08:58 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/txn.o
10:09:00 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/dbi.o
10:09:02 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/cursor.o
10:09:03 AM: [debug] [npm-install]: CXX(target) Release/obj.target/lmdb/src/v8-functions.o
10:09:04 AM: [debug] [npm-install]: CC(target) Release/obj.target/lmdb/dependencies/lmdb/libraries/liblmdb/mdb.o
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c: In function 'mdb_page_unspill':
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:2930:26: warning: format '%u' expects argument of type 'unsigned int', but argument 3 has type 'pgno_t' {aka 'long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 2930 | fprintf(stderr, "Page %u was unspilled, but was not found in spilled page list (%p)\n", mp->mp_pgno, txn->mt_spill_pgs);
10:09:05 AM: [debug] [npm-install]: | ~^
10:09:05 AM: [debug] [npm-install]: | |
10:09:05 AM: [debug] [npm-install]: | unsigned int
10:09:05 AM: [debug] [npm-install]: | %lu
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c: In function 'mdb_txn_renew0':
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:3308:57: warning: format '%i' expects argument of type 'int', but argument 4 has type 'txnid_t' {aka 'volatile long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 3308 | sprintf(last_error, "The reader lock pid %u, txn %i, doesn't match env pid %u", r->mr_pid, r->mr_txnid, env->me_pid);
10:09:05 AM: [debug] [npm-install]: | ~^
10:09:05 AM: [debug] [npm-install]: | |
10:09:05 AM: [debug] [npm-install]: | int
10:09:05 AM: [debug] [npm-install]: | %li
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:3310:58: warning: format '%i' expects argument of type 'int', but argument 3 has type 'txnid_t' {aka 'volatile long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 3310 | sprintf(last_error, "The reader lock has a txn id %i", r->mr_txnid);
10:09:05 AM: [debug] [npm-install]: | ~^
10:09:05 AM: [debug] [npm-install]: | |
10:09:05 AM: [debug] [npm-install]: | int
10:09:05 AM: [debug] [npm-install]: | %li
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c: In function 'mdb_txn_commit':
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:4562:84: warning: format '%u' expects argument of type 'unsigned int', but argument 4 has type 'MDB_ID' {aka 'long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 4562 | sprintf(last_error, "The loose count %i is less than the size of the dirty list %u", txn->mt_loose_count, txn->mt_u.dirty_list[0].mid);
10:09:05 AM: [debug] [npm-install]: | ~^ ~~~~~~~~~~~~~~~~~~~~~~~~~~~
10:09:05 AM: [debug] [npm-install]: | | |
10:09:05 AM: [debug] [npm-install]: | unsigned int MDB_ID {aka long unsigned int}
10:09:05 AM: [debug] [npm-install]: | %lu
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c: In function 'mdb_get':
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:7792:90: warning: format '%u' expects argument of type 'unsigned int', but argument 5 has type 'txnid_t' {aka 'long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 7792 | sprintf(last_error, "The dbi %u was out of range for the number of dbis (txn: %u id: %u, env: %u txnid: %u)", dbi, (txn)->mt_numdbs, txn->mt_txnid, txn->mt_env->me_numdbs, meta->mm_txnid);
10:09:05 AM: [debug] [npm-install]: | ~^ ~~~~~~~~~~~~~
10:09:05 AM: [debug] [npm-install]: | | |
10:09:05 AM: [debug] [npm-install]: | unsigned int txnid_t {aka long unsigned int}
10:09:05 AM: [debug] [npm-install]: | %lu
10:09:05 AM: [debug] [npm-install]: ../dependencies/lmdb/libraries/liblmdb/mdb.c:7792:109: warning: format '%u' expects argument of type 'unsigned int', but argument 7 has type 'txnid_t' {aka 'volatile long unsigned int'} [-Wformat=]
10:09:05 AM: [debug] [npm-install]: 7792 | sprintf(last_error, "The dbi %u was out of range for the number of dbis (txn: %u id: %u, env: %u txnid: %u)", dbi, (txn)->mt_numdbs, txn->mt_txnid, txn->mt_env->me_numdbs, meta->mm_txnid);
10:09:05 AM: [debug] [npm-install]: | ~^ ~~~~~~~~~~~~~~
10:09:05 AM: [debug] [npm-install]: | | |
10:09:05 AM: [debug] [npm-install]: | unsigned int txnid_t {aka volatile long unsigned int}
10:09:05 AM: [debug] [npm-install]: | %lu
10:09:07 AM: [debug] [npm-install]: SOLINK_MODULE(target) Release/obj.target/lmdb.node
10:09:07 AM: [debug] [npm-install]: COPY Release/lmdb.node
10:09:07 AM: [debug] [npm-install]: make: Leaving directory '/home/appuser/app/node_modules/lmdb/build'
10:09:07 AM: [debug] [npm-install]: > esbuild@0.19.12 postinstall /home/appuser/app/node_modules/esbuild
10:09:07 AM: [debug] [npm-install]: > node install.js
10:09:08 AM: [debug] [npm-install]: > es5-ext@0.10.64 postinstall /home/appuser/app/node_modules/es5-ext
10:09:08 AM: [debug] [npm-install]: > node -e "try{require('./_postinstall')}catch(e){}" || exit 0
10:09:08 AM: [debug] [npm-install]: > @netlify/content-engine@1.8.1 postinstall /home/appuser/app/node_modules/@netlify/content-engine
10:09:08 AM: [debug] [npm-install]: > node scripts/postinstall.js
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for fs-extra@11.3.0: wanted: {"node":">=14.14"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: fs-extra@11.3.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @netlify/content-engine@1.8.1: wanted: {"node":">=16.0.0"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @netlify/content-engine@1.8.1
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for graphql@16.10.0: wanted: {"node":"^12.22.0 || ^14.16.0 || ^16.0.0 || >=17.0.0"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: graphql@16.10.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for minizlib@3.0.1: wanted: {"node":">= 18"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: minizlib@3.0.1
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for import-from@4.0.0: wanted: {"node":">=12.2"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: import-from@4.0.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for graphql-http@1.22.4: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: graphql-http@1.22.4
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @netlify/content-engine-graphiql-explorer@1.1.0: wanted: {"node":">=18.19.0"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @netlify/content-engine-graphiql-explorer@1.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for readable-stream@4.7.0: wanted: {"node":"^12.22.0 || ^14.17.0 || >=16.0.0"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: readable-stream@4.7.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for minimatch@9.0.5: wanted: {"node":">=16 || 14 >=14.17"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: minimatch@9.0.5
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for minipass@7.1.2: wanted: {"node":">=16 || 14 >=14.17"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: minipass@7.1.2
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for foreground-child@3.3.1: wanted: {"node":">=14"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: foreground-child@3.3.1
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for path-scurry@1.11.1: wanted: {"node":">=16 || 14 >=14.18"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: path-scurry@1.11.1
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for signal-exit@4.1.0: wanted: {"node":">=14"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: signal-exit@4.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @isaacs/cliui@8.0.2: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @isaacs/cliui@8.0.2
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @pkgjs/parseargs@0.11.0: wanted: {"node":">=14"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @pkgjs/parseargs@0.11.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for strip-ansi@7.1.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: strip-ansi@7.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for string-width@5.1.2: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: string-width@5.1.2
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for wrap-ansi@8.1.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: wrap-ansi@8.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for strip-ansi@7.1.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: strip-ansi@7.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for ansi-regex@6.1.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: ansi-regex@6.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for strip-ansi@7.1.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: strip-ansi@7.1.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for ansi-styles@6.2.1: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: ansi-styles@6.2.1
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @lmdb/lmdb-linux-arm@2.5.3 (node_modules/lmdb/node_modules/@lmdb/lmdb-linux-arm):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @lmdb/lmdb-linux-arm@2.5.3: wanted {"os":"linux","arch":"arm"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @lmdb/lmdb-win32-x64@2.5.3 (node_modules/lmdb/node_modules/@lmdb/lmdb-win32-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @lmdb/lmdb-win32-x64@2.5.3: wanted {"os":"win32","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @lmdb/lmdb-darwin-x64@2.5.3 (node_modules/lmdb/node_modules/@lmdb/lmdb-darwin-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @lmdb/lmdb-darwin-x64@2.5.3: wanted {"os":"darwin","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @lmdb/lmdb-darwin-arm64@2.5.3 (node_modules/lmdb/node_modules/@lmdb/lmdb-darwin-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @lmdb/lmdb-darwin-arm64@2.5.3: wanted {"os":"darwin","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @lmdb/lmdb-linux-arm64@2.5.3 (node_modules/lmdb/node_modules/@lmdb/lmdb-linux-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @lmdb/lmdb-linux-arm64@2.5.3: wanted {"os":"linux","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @msgpackr-extract/msgpackr-extract-darwin-x64@3.0.3 (node_modules/msgpackr-extract/node_modules/@msgpackr-extract/msgpackr-extract-darwin-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @msgpackr-extract/msgpackr-extract-darwin-x64@3.0.3: wanted {"os":"darwin","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @msgpackr-extract/msgpackr-extract-darwin-arm64@3.0.3 (node_modules/msgpackr-extract/node_modules/@msgpackr-extract/msgpackr-extract-darwin-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @msgpackr-extract/msgpackr-extract-darwin-arm64@3.0.3: wanted {"os":"darwin","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @msgpackr-extract/msgpackr-extract-linux-arm@3.0.3 (node_modules/msgpackr-extract/node_modules/@msgpackr-extract/msgpackr-extract-linux-arm):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @msgpackr-extract/msgpackr-extract-linux-arm@3.0.3: wanted {"os":"linux","arch":"arm"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @msgpackr-extract/msgpackr-extract-linux-arm64@3.0.3 (node_modules/msgpackr-extract/node_modules/@msgpackr-extract/msgpackr-extract-linux-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @msgpackr-extract/msgpackr-extract-linux-arm64@3.0.3: wanted {"os":"linux","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @msgpackr-extract/msgpackr-extract-win32-x64@3.0.3 (node_modules/msgpackr-extract/node_modules/@msgpackr-extract/msgpackr-extract-win32-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @msgpackr-extract/msgpackr-extract-win32-x64@3.0.3: wanted {"os":"win32","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for minimatch@9.0.5: wanted: {"node":">=16 || 14 >=14.17"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: minimatch@9.0.5
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for esbuild@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: esbuild@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @notionhq/client@2.3.0: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @notionhq/client@2.3.0
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for eventsource@2.0.2: wanted: {"node":">=12.0.0"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: eventsource@2.0.2
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for notion-to-md@3.1.7: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: notion-to-md@3.1.7
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2 (node_modules/chokidar/node_modules/fsevents):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/aix-ppc64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/aix-ppc64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/aix-ppc64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/aix-ppc64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/aix-ppc64@0.19.12: wanted {"os":"aix","arch":"ppc64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/sunos-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/sunos-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/sunos-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/sunos-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/sunos-x64@0.19.12: wanted {"os":"sunos","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-arm@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-arm@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-arm@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-arm):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-arm@0.19.12: wanted {"os":"linux","arch":"arm"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/netbsd-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/netbsd-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/netbsd-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/netbsd-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/netbsd-x64@0.19.12: wanted {"os":"netbsd","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-ia32@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-ia32@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-ia32@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-ia32):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-ia32@0.19.12: wanted {"os":"linux","arch":"ia32"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/android-arm@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/android-arm@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/android-arm@0.19.12 (node_modules/esbuild/node_modules/@esbuild/android-arm):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/android-arm@0.19.12: wanted {"os":"android","arch":"arm"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/win32-ia32@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/win32-ia32@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/win32-ia32@0.19.12 (node_modules/esbuild/node_modules/@esbuild/win32-ia32):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/win32-ia32@0.19.12: wanted {"os":"win32","arch":"ia32"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/darwin-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/darwin-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/darwin-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/darwin-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/darwin-x64@0.19.12: wanted {"os":"darwin","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/win32-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/win32-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/win32-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/win32-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/win32-x64@0.19.12: wanted {"os":"win32","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/android-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/android-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/android-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/android-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/android-x64@0.19.12: wanted {"os":"android","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-arm64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-arm64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-arm64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-arm64@0.19.12: wanted {"os":"linux","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/freebsd-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/freebsd-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/freebsd-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/freebsd-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/freebsd-x64@0.19.12: wanted {"os":"freebsd","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-ppc64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-ppc64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-ppc64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-ppc64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-ppc64@0.19.12: wanted {"os":"linux","arch":"ppc64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-s390x@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-s390x@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-s390x@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-s390x):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-s390x@0.19.12: wanted {"os":"linux","arch":"s390x"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/openbsd-x64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/openbsd-x64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/openbsd-x64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/openbsd-x64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/openbsd-x64@0.19.12: wanted {"os":"openbsd","arch":"x64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/android-arm64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/android-arm64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/android-arm64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/android-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/android-arm64@0.19.12: wanted {"os":"android","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/win32-arm64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/win32-arm64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/win32-arm64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/win32-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/win32-arm64@0.19.12: wanted {"os":"win32","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/darwin-arm64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/darwin-arm64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/darwin-arm64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/darwin-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/darwin-arm64@0.19.12: wanted {"os":"darwin","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/freebsd-arm64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/freebsd-arm64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/freebsd-arm64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/freebsd-arm64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/freebsd-arm64@0.19.12: wanted {"os":"freebsd","arch":"arm64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-riscv64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-riscv64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-riscv64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-riscv64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-riscv64@0.19.12: wanted {"os":"linux","arch":"riscv64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-loong64@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-loong64@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-loong64@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-loong64):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-loong64@0.19.12: wanted {"os":"linux","arch":"loong64"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Unsupported engine for @esbuild/linux-mips64el@0.19.12: wanted: {"node":">=12"} (current: {"node":"10.23.0","npm":"6.14.8"})
10:09:08 AM: [debug] [npm-install]: npm WARN notsup Not compatible with your version of node/npm: @esbuild/linux-mips64el@0.19.12
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @esbuild/linux-mips64el@0.19.12 (node_modules/esbuild/node_modules/@esbuild/linux-mips64el):
10:09:08 AM: [debug] [npm-install]: npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @esbuild/linux-mips64el@0.19.12: wanted {"os":"linux","arch":"mips64el"} (current: {"os":"linux","arch":"x64"})
10:09:08 AM: [debug] [npm-install]: npm WARN @netlify/content-engine@1.8.1 requires a peer of @google-cloud/storage@^5.8.4 but none is installed. You must install peer dependencies yourself.
10:09:08 AM: [debug] [npm-install]: npm WARN app No description
10:09:08 AM: [debug] [npm-install]: npm WARN app No repository field.
10:09:08 AM: [debug] [npm-install]: npm WARN app No license field.
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: msgpackr-extract@3.0.3 (node_modules/msgpackr-extract):
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: msgpackr-extract@3.0.3 install: `node-gyp-build-optional-packages`
10:09:08 AM: [debug] [npm-install]: npm WARN optional SKIPPING OPTIONAL DEPENDENCY: Exit status 1
10:09:08 AM: [debug] [npm-install]: added 510 packages from 386 contributors and updated 1 package in 86.842s
10:09:08 AM: [debug] [npm-install]: 83 packages are looking for funding
10:09:08 AM: [debug] [npm-install]: run `npm fund` for details
10:09:09 AM: [info] ✅ Done
10:09:09 AM:
10:09:09 AM: Loading Stackbit config
10:09:09 AM: ───────────────────────────────
10:09:09 AM: [info] Current working directory: .
10:09:10 AM: [warn] error in stackbit config: "assetSources[0].type" is required
10:09:10 AM: [warn] error in stackbit config: "assetSources[0].title" is not allowed
10:09:10 AM: [warn] error in stackbit config: "assetSources[0].icon" is not allowed
10:09:10 AM: [warn] error in stackbit config: "assetSources[0].url" is not allowed
10:09:10 AM: [info] Loaded config from 'stackbit.config.js'
10:09:10 AM: [info] Content sources found: git (project: 11b04403, version: 1.0.35)
10:09:10 AM: [info] ✅ Done
10:09:10 AM:
10:09:10 AM: Loading content
10:09:10 AM: ───────────────────────
10:09:10 AM: [info] Using Content Source Interface
10:09:10 AM: [info] Initializing content source: git (project: 11b04403)
10:09:10 AM: [warn] No `assetsConfig` option provided, asset handling will be turned off.
10:09:10 AM: [debug] getSchema
10:09:10 AM: [info] → Loaded git content source data (project: 11b04403): 12 models, 7 documents and 0 assets
10:09:10 AM: [warn] models[name='home'].fields[name='sections'].items.models[0] must reference the name of an existing model of type "page" or "data", got "HeroSection"
10:09:10 AM: [warn] models[name='home'].fields[name='sections'].items.models[1] must reference the name of an existing model of type "page" or "data", got "ProvenTrackRecordSection"
10:09:10 AM: [warn] models[name='home'].fields[name='sections'].items.models[2] must reference the name of an existing model of type "page" or "data", got "PastInvestmentsSection"
10:09:10 AM: [warn] models[name='home'].fields[name='sections'].items.models[3] must reference the name of an existing model of type "page" or "data", got "PerformanceSection"
10:09:10 AM: [warn] models[name='home'].fields[name='sections'].items.models[4] must reference the name of an existing model of type "page" or "data", got "LogoShowcaseSection"
10:09:10 AM: [info] ✅ Done
10:09:10 AM:
10:09:10 AM: Running dev server
10:09:10 AM: ──────────────────────────
10:09:10 AM: [info] Current working directory: .
10:09:10 AM: [info] Running dev server using: 'undefined '...
10:09:10 AM: [info] to configure a different command use `devCommand`
10:09:10 AM: [error] ❌ Service stopping