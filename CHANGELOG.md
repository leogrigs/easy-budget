# [1.7.0](https://github.com/leogrigs/easy-budget/compare/v1.6.0...v1.7.0) (2026-04-25)


### Features

* **expense-form:** installment switch with per-part preview ([a8439dd](https://github.com/leogrigs/easy-budget/commit/a8439ddf31e62a67fa1305036d5ae1e8d2b255d5))
* **expense:** add installment fields to Expense type and Firestore rules ([4c0c221](https://github.com/leogrigs/easy-budget/commit/4c0c2219a7e0782e5dec44dc389ac31a2651473c))
* **expenses:** installment purchase service ([5958bf1](https://github.com/leogrigs/easy-budget/commit/5958bf14eb017b78eb1ba63b2da6ef457bbf83a1))
* **expenses:** wire installment create + delete-entire-purchase flow ([0f7b545](https://github.com/leogrigs/easy-budget/commit/0f7b54592a15be2b241f917c302b3634e30037dd))
* **totalizers:** optional Installments card ([5850897](https://github.com/leogrigs/easy-budget/commit/585089743412ffb30cf30f2ebeec5b202c0f9611))

# [1.6.0](https://github.com/leogrigs/easy-budget/compare/v1.5.0...v1.6.0) (2026-04-25)


### Bug Fixes

* **expenses:** robust error handling on bulk actions and refunded toggle ([6af6187](https://github.com/leogrigs/easy-budget/commit/6af6187fc1819dba6cf0e677843e37d2ae465639))
* **group-detail:** adopt deleteGroupWithExpenses and resolveGroupIdPatch ([f289760](https://github.com/leogrigs/easy-budget/commit/f2897607d0f47ab2d61622e409250051b9d0415e))
* **group-form:** snapshot initialValue in a ref to stop reset loops ([633a6ff](https://github.com/leogrigs/easy-budget/commit/633a6ff9dfa48fb9b11c831e7898f3547b8fcd7c))
* **groups:** use atomic delete and a stable order on create ([13b617b](https://github.com/leogrigs/easy-budget/commit/13b617bc1e1c7417ed734427a5d4059b8c12691e))


### Features

* **groups:** atomic deleteGroupWithExpenses + stricter update rule ([716b03e](https://github.com/leogrigs/easy-budget/commit/716b03e550691e87e97099ccb10acce2d749729c))

# [1.5.0](https://github.com/leogrigs/easy-budget/compare/v1.4.0...v1.5.0) (2026-04-24)


### Bug Fixes

* **filters:** keep column-header popover open on select ([3f3c73a](https://github.com/leogrigs/easy-budget/commit/3f3c73aedf3a2e451406c98562b841839ad2fe55))


### Features

* **expenses:** column-header filters + bulk change group ([f14995c](https://github.com/leogrigs/easy-budget/commit/f14995c66dbcd42f292132a02d37cc346c360c16))
* **groups:** group expenses by occasion ([63747e4](https://github.com/leogrigs/easy-budget/commit/63747e4aa3de72f9c643956debf07796315b53a0))
* **security:** guard Firebase services with App Check + reCAPTCHA Enterprise ([a12da95](https://github.com/leogrigs/easy-budget/commit/a12da95df2ae1385f32c4b40581abb2f54a2c90a))

# [1.4.0](https://github.com/leogrigs/easy-budget/compare/v1.3.0...v1.4.0) (2026-04-21)


### Features

* **import:** smart import via Firebase AI Logic + editable review ([e8adf4a](https://github.com/leogrigs/easy-budget/commit/e8adf4aff23925475e16538cd00ceeb6073558ee))

# [1.3.0](https://github.com/leogrigs/easy-budget/compare/v1.2.0...v1.3.0) (2026-04-21)


### Bug Fixes

* **insights:** invert delta colors so spending increases read as red ([8d75eca](https://github.com/leogrigs/easy-budget/commit/8d75eca419b7d82f1c3717cc6de95149ea9c1026))


### Features

* **insights:** month switcher matching the Expenses pattern ([6677186](https://github.com/leogrigs/easy-budget/commit/66771869c43a1d1cc20316c7d2355651afcdba91))

# [1.2.0](https://github.com/leogrigs/easy-budget/compare/v1.1.0...v1.2.0) (2026-04-21)


### Bug Fixes

* **expenses:** inline refund toggle handler to satisfy useMemo deps ([81117ec](https://github.com/leogrigs/easy-budget/commit/81117ec488a4e4a72f78a57272ca5fdfd5b9d976))
* **expenses:** tighten mobile layout for header and filters ([123477f](https://github.com/leogrigs/easy-budget/commit/123477fb4c6f10d0cb4723d06fac1b400b00599d))
* **filters:** keep category dropdown open across multi-select ([4e0ba04](https://github.com/leogrigs/easy-budget/commit/4e0ba04e87c607a661091c298d79d6e967ec14d5))
* **services:** strip undefined before writing to Firestore ([b9e8db6](https://github.com/leogrigs/easy-budget/commit/b9e8db623fa824ce46aea498298bf6c15ed660d3))


### Features

* **expenses:** mark as refunded to exclude from totals and insights ([d36da0c](https://github.com/leogrigs/easy-budget/commit/d36da0c11312b10423e05c9f18f7fe26831567da))
* **expenses:** month switcher, fixed KPI, and promote to recurring ([044282f](https://github.com/leogrigs/easy-budget/commit/044282f5e6e4b78fdf7faeea8f39e19c46411b1f))
* **expenses:** show a Repeat icon on rows that are part of a recurring template ([486e98f](https://github.com/leogrigs/easy-budget/commit/486e98fcdc2e8ed40a8e7a896dc64e1f9eeb5e10))

# [1.1.0](https://github.com/leogrigs/easy-budget/compare/v1.0.4...v1.1.0) (2026-04-20)


### Bug Fixes

* **insights:** drop white stroke on the donut chart ([902e71d](https://github.com/leogrigs/easy-budget/commit/902e71d5579e43295255f0177e42ca985f38d3f2))
* **table:** make pagination controlled and move bar to the top ([ef6176a](https://github.com/leogrigs/easy-budget/commit/ef6176ac765da48bdde3b757dfa85ee00848890e))
* **ui:** checkbox shows minus icon for indeterminate state ([aeb7a6d](https://github.com/leogrigs/easy-budget/commit/aeb7a6d92ff38c694b580559e79ec2946e278c26))
* **ui:** currency input with prefix, no native spinners ([e72d411](https://github.com/leogrigs/easy-budget/commit/e72d4119476ed0f31c7c064560ea491bab96c2b8))
* **ui:** logo mark, date picker unification, table + dialog polish ([d35c2c8](https://github.com/leogrigs/easy-budget/commit/d35c2c8a45036b84d3873af0addf12c8a02fc538))


### Features

* **auth:** modern hero landing page ([c1c5d33](https://github.com/leogrigs/easy-budget/commit/c1c5d33bca65a7a91367c53871923d0254c93e87))
* **categories:** CRUD page with color + icon ([ba030f5](https://github.com/leogrigs/easy-budget/commit/ba030f5a241ca435f0fba320bdef228587798608))
* **csv:** export and import flows ([6cfc612](https://github.com/leogrigs/easy-budget/commit/6cfc612aeb27e50add1dee849043d822ec199f1e))
* **expenses:** tanstack DataTable with filters and bulk actions ([003abbf](https://github.com/leogrigs/easy-budget/commit/003abbf283366b42539ccebf4755d30558a82f2a))
* **firestore:** rules for expenses/categories/recurring subcollections ([28d27af](https://github.com/leogrigs/easy-budget/commit/28d27afbdf6d0e8641d253b153391ddcaa9568f8))
* **firestore:** subcollection schema, services, hooks ([23c97dd](https://github.com/leogrigs/easy-budget/commit/23c97ddc79b73d2964a7a2ca0e8978c6bc3706ef))
* **import:** auto-create unmapped categories ([d207d67](https://github.com/leogrigs/easy-budget/commit/d207d67fec5595022379ba1eb6f709cd0410ef33))
* **insights:** aggregation utilities ([2426a3a](https://github.com/leogrigs/easy-budget/commit/2426a3aab9ab1c561a691ecef27f5d3f25c797e2))
* **insights:** page, route, and nav entry ([9442ab0](https://github.com/leogrigs/easy-budget/commit/9442ab05580b8d75efb05648fa54d7f3c8decea7))
* **insights:** period selector, KPI card, and chart components ([e9783e5](https://github.com/leogrigs/easy-budget/commit/e9783e5ce3fcf602d7cf7f985b408e4bef1ebb9c))
* **layout:** modern shell with sidebar, topbar, and skeletons ([8c26cb9](https://github.com/leogrigs/easy-budget/commit/8c26cb9b0973c16927b2875df5680bca235990dd))
* **recurring:** recurring expenses with backfill on login ([2ae2efe](https://github.com/leogrigs/easy-budget/commit/2ae2efed36a066ac4089e8ab91357d7cd565a57b))
* **setup:** wire shadcn tokens, path alias, router shell ([4d8c2e3](https://github.com/leogrigs/easy-budget/commit/4d8c2e3cda14354ba1bd0081327195df2c8f6df2))
* **ui:** install shadcn primitives ([ec51321](https://github.com/leogrigs/easy-budget/commit/ec51321459569f9d2453bc851014c85505404de3))
* **ux:** floating selection bar, route + card enter animations ([0b443ce](https://github.com/leogrigs/easy-budget/commit/0b443ce014e37422c097de86bdf4c074c02b8989))

## [1.0.4](https://github.com/leogrigs/easy-budget/compare/v1.0.3...v1.0.4) (2024-11-12)


### Bug Fixes

* **budget-table:** unit tests ([1f0396a](https://github.com/leogrigs/easy-budget/commit/1f0396a68397ef42a1762218cfc0e9aa0d0a8e61))

## [1.0.3](https://github.com/leogrigs/easy-budget/compare/v1.0.2...v1.0.3) (2024-11-07)


### Bug Fixes

* badge path ([e650a72](https://github.com/leogrigs/easy-budget/commit/e650a72f0524c91f20817c01bec76fb41673fced))
* badge path ([e15827b](https://github.com/leogrigs/easy-budget/commit/e15827b506cbeb1b8a1e1e3e9a850d8b4141c390))
* build problem ([8b47313](https://github.com/leogrigs/easy-budget/commit/8b473136e0a46a62ba35820423ca269061cd1ef6))

## [1.0.2](https://github.com/leogrigs/easy-budget/compare/v1.0.1...v1.0.2) (2024-11-06)


### Bug Fixes

* Input component unit test ([6aca646](https://github.com/leogrigs/easy-budget/commit/6aca646955d1a0e336ec41263a78ea3912e13f9b))
* tsconfig test configuration ([0312405](https://github.com/leogrigs/easy-budget/commit/0312405f9750044b3108c980014bb558264458be))
* tsconfig test file configuration ([2a55d52](https://github.com/leogrigs/easy-budget/commit/2a55d5208219bc5f90bfafa7edefbbaabb03f036))
* vitest extension setup ([863d00b](https://github.com/leogrigs/easy-budget/commit/863d00b364a1442b0d19b76d6c0afc4f39ab1d20))

## [1.0.1](https://github.com/leogrigs/easy-budget/compare/v1.0.0...v1.0.1) (2024-11-05)


### Bug Fixes

* add missing dependency jsdom ([255c8c8](https://github.com/leogrigs/easy-budget/commit/255c8c8cacad6e93a7a4eb8c8c2e27aac9f1fd3d))
* exclude tests from build ([3318fbe](https://github.com/leogrigs/easy-budget/commit/3318fbe4b95cefedcf2197c1e8941dbae7dedcec))

## [0.21.2](https://github.com/leogrigs/easy-budget/compare/v0.21.1...v0.21.2) (2024-11-04)


### Bug Fixes

* **budget-table:** delete action ([ec6137e](https://github.com/leogrigs/easy-budget/commit/ec6137e0bcea7592e50c47c08531b4e90e7aa353))
* build problems ([ce7a225](https://github.com/leogrigs/easy-budget/commit/ce7a225d268e5a3943b76ffcd98439d8dc1f7d73))
* import font on index.css ([ff804d6](https://github.com/leogrigs/easy-budget/commit/ff804d668533127b04257e26d2774ddffd53bd05))

## [0.21.1](https://github.com/leogrigs/easy-budget/compare/v0.21.0...v0.21.1) (2024-11-03)


### Bug Fixes

* **no-results:** add png image and dark / light mode handling ([3db77d0](https://github.com/leogrigs/easy-budget/commit/3db77d08946e724474cc74c0b538d67132e4eebb))

# [0.21.0](https://github.com/leogrigs/easy-budget/compare/v0.20.0...v0.21.0) (2024-11-03)


### Features

* **button:** button component creation ([3c0a389](https://github.com/leogrigs/easy-budget/commit/3c0a38976f64031431a3b87e58569df28518c4a1))

# [0.20.0](https://github.com/leogrigs/easy-budget/compare/v0.19.0...v0.20.0) (2024-11-03)


### Bug Fixes

* **responsivity:** lost adjusts ([d84a76c](https://github.com/leogrigs/easy-budget/commit/d84a76c55881d227e040ca3f83842106dfc59235))


### Features

* **responsivity:** app component ([6f9ae15](https://github.com/leogrigs/easy-budget/commit/6f9ae150c76bb6ce4777dfe9d881e9581091e3e6))
* **responsivity:** auth component ([90681da](https://github.com/leogrigs/easy-budget/commit/90681dac310f9d891dfb1f5f5197d1b3505e9546))
* **responsivity:** budget table component ([f2200d3](https://github.com/leogrigs/easy-budget/commit/f2200d364aa2f36bea37b40fb5b426e147b814c8))
* **responsivity:** chart component ([a69e313](https://github.com/leogrigs/easy-budget/commit/a69e31315235a8eb2b3ebefe2b56ffccf79cc6d1))
* **responsivity:** minor spacing details ([306b102](https://github.com/leogrigs/easy-budget/commit/306b10212d6bfa716bc976288043876d1383017c))
* **responsivity:** system component adjusts ([8c5537a](https://github.com/leogrigs/easy-budget/commit/8c5537a566dec7a0fa30759ff49f99bc79b07211))
* **responsivity:** totalizers component ([02bde58](https://github.com/leogrigs/easy-budget/commit/02bde58452fc8dc778e12e304869aa27178174aa))

# [0.19.0](https://github.com/leogrigs/easy-budget/compare/v0.18.3...v0.19.0) (2024-11-02)


### Features

* **theme:** dark mode auth component ([e665623](https://github.com/leogrigs/easy-budget/commit/e665623ba623cbb022bfe1cac457adfeb488b029))
* **theme:** dark mode budget table cell component ([894da57](https://github.com/leogrigs/easy-budget/commit/894da57d9851334605b066b028708e6d1d0efb5c))
* **theme:** dark mode budget table component ([c2a4d17](https://github.com/leogrigs/easy-budget/commit/c2a4d171de8c4fae1f05b178427dfcfd6e67fdd5))
* **theme:** dark mode category chip component ([286b711](https://github.com/leogrigs/easy-budget/commit/286b7110ff97aab6e9ad950cf8f2dd08b99a637e))
* **theme:** dark mode entry form component ([3b1b16d](https://github.com/leogrigs/easy-budget/commit/3b1b16df407405561ab32afcfadab930e5ed3a8f))
* **theme:** dark mode input component ([aa0435c](https://github.com/leogrigs/easy-budget/commit/aa0435c0e792d0e2d7249e2268fbce23b1e4bf25))
* **theme:** dark mode modal component ([0166d28](https://github.com/leogrigs/easy-budget/commit/0166d28e98668b62f5f11d6ed5d3f13d1521391b))
* **theme:** dark mode paginator component ([b6b5045](https://github.com/leogrigs/easy-budget/commit/b6b50450feba919f55f4e03055a299ae534011d7))
* **theme:** dark mode select component ([220826d](https://github.com/leogrigs/easy-budget/commit/220826debbe3e8c37d6ae2760ad42cd9a2bcd636))
* **theme:** dark mode totalizers component ([8cfa545](https://github.com/leogrigs/easy-budget/commit/8cfa54505e2720b854b6d13fcb398b140cd5647e))
* **theme:** dark-mode set up ([c4cb1e6](https://github.com/leogrigs/easy-budget/commit/c4cb1e6968431a67ce1060537b2f8a9a42b501a1))

## [0.18.3](https://github.com/leogrigs/easy-budget/compare/v0.18.2...v0.18.3) (2024-11-01)


### Bug Fixes

* **loader:** stop loader on Auth page ([a95f093](https://github.com/leogrigs/easy-budget/commit/a95f093f8654de26cec2b96b4f554e11b4c15692))

## [0.18.2](https://github.com/leogrigs/easy-budget/compare/v0.18.1...v0.18.2) (2024-10-31)


### Bug Fixes

* **chart:** total expenses inside chart calculation ([ac0b126](https://github.com/leogrigs/easy-budget/commit/ac0b126b8265092ae01cbacd5ac3bdd9fbb92219))

## [0.18.1](https://github.com/leogrigs/easy-budget/compare/v0.18.0...v0.18.1) (2024-10-30)


### Bug Fixes

* **budget-table:** category chip color ([6e48344](https://github.com/leogrigs/easy-budget/commit/6e48344e147f4de46458146007e0724cb0bfa062))

# [0.18.0](https://github.com/leogrigs/easy-budget/compare/v0.17.0...v0.18.0) (2024-10-30)


### Features

* **loader:** component creation ([1ffbc0b](https://github.com/leogrigs/easy-budget/commit/1ffbc0bff6d55cb5f093d6ace77b700ebc0f6e08))

# [0.17.0](https://github.com/leogrigs/easy-budget/compare/v0.16.0...v0.17.0) (2024-10-29)


### Bug Fixes

* **budget-table:** reindexing ids on entry delete ([a8ab9f7](https://github.com/leogrigs/easy-budget/commit/a8ab9f76acb647b432c7079a07857960fc14cdf3))


### Features

* **budget-table:** month and year filter ([b6ba2b4](https://github.com/leogrigs/easy-budget/commit/b6ba2b4a772e0dd1ecc959b55e17ad97d8d024de))

# [0.16.0](https://github.com/leogrigs/easy-budget/compare/v0.15.1...v0.16.0) (2024-10-28)


### Bug Fixes

* **budget-table:** directly image import ([047024d](https://github.com/leogrigs/easy-budget/commit/047024d1e1550b55d7cd5945d2775906e993dad5))


### Features

* **budget-table:** improve date visualization ([d7a48ea](https://github.com/leogrigs/easy-budget/commit/d7a48ea24e1e7e6c29d16ad443fa855b9412dd8b))
* **budget-table:** stylized dynamic category component ([ce732f4](https://github.com/leogrigs/easy-budget/commit/ce732f43aa25629210f5113fc3f8182ffa91f0ac))

## [0.15.1](https://github.com/leogrigs/easy-budget/compare/v0.15.0...v0.15.1) (2024-10-28)


### Bug Fixes

* **chart:** reduced margin bottom ([17cb3fb](https://github.com/leogrigs/easy-budget/commit/17cb3fb867e126efae93455cfbb8533520f54240))

# [0.15.0](https://github.com/leogrigs/easy-budget/compare/v0.14.0...v0.15.0) (2024-10-27)


### Features

* **dashboard:** initial structure pie chart component ([4da6fd7](https://github.com/leogrigs/easy-budget/commit/4da6fd7ff285e61c088cc5b99a2984cbf42cc6ce))

# [0.14.0](https://github.com/leogrigs/easy-budget/compare/v0.13.0...v0.14.0) (2024-10-27)


### Bug Fixes

* **entry:** new entry undefined ([10805ae](https://github.com/leogrigs/easy-budget/commit/10805ae0185191c4b6c2dbfe91a2cecbbf6f7c31))
* remove old new entry button ([c5c14e6](https://github.com/leogrigs/easy-budget/commit/c5c14e617cbec2202da70b330f63aaaad1b8f839))


### Features

* **entry:** delete entry ([b66f348](https://github.com/leogrigs/easy-budget/commit/b66f348395a0aaf00209362c211d8923d0d5c79e))
* **entry:** disable confirm form button while form isn't full filled ([7da36b3](https://github.com/leogrigs/easy-budget/commit/7da36b3883604f6cd0928742edcbcfca22f87925))
* **entry:** edit entry ([ac4d40d](https://github.com/leogrigs/easy-budget/commit/ac4d40d381568d3947ef949f2ed7f2cf604e370a))

# [0.13.0](https://github.com/leogrigs/easy-budget/compare/v0.12.0...v0.13.0) (2024-10-26)


### Bug Fixes

* **budget-table:** id on new entry ([2ab3116](https://github.com/leogrigs/easy-budget/commit/2ab311646a8ad9ce38f491d0e9305781b0a27bfd))
* **budget-table:** inverted bullet colors ([98a4011](https://github.com/leogrigs/easy-budget/commit/98a4011df120416f6af12417d516d968f9092533))


### Features

* **budget-table:** actions column ([91a4a10](https://github.com/leogrigs/easy-budget/commit/91a4a10f9ba3ea27b6a1d846ae5ec5e824a3226e))
* **budget-table:** budget table cell component ([70eaf4f](https://github.com/leogrigs/easy-budget/commit/70eaf4f347335a7533dcaf786c296e566aae3f0c))

# [0.12.0](https://github.com/leogrigs/easy-budget/compare/v0.11.1...v0.12.0) (2024-10-26)


### Bug Fixes

* **budget-table:** bullet colors ([7bc5a33](https://github.com/leogrigs/easy-budget/commit/7bc5a334fffa19d315f1a8136b11ee7199c01c82))
* **budget-table:** return bullet color fix lost on merge ([ac6aa39](https://github.com/leogrigs/easy-budget/commit/ac6aa39b41cd02504b0896512bcaf6792f85c4d8))


### Features

* **budget-table:** initial no entries state ([8d4086c](https://github.com/leogrigs/easy-budget/commit/8d4086cd5e630d9f4f4b7959d64a574220fd158e))
* **budget-table:** no results stylized component ([1b4bd74](https://github.com/leogrigs/easy-budget/commit/1b4bd74fc2cf14c049a3e0621e754438e2099362))

## [0.11.1](https://github.com/leogrigs/easy-budget/compare/v0.11.0...v0.11.1) (2024-10-25)


### Bug Fixes

* **new-entry:** entry creation data interface ([e214988](https://github.com/leogrigs/easy-budget/commit/e2149880c1b5333697efcc00f55a4fbff8677ef5))
* type error ([87c74c0](https://github.com/leogrigs/easy-budget/commit/87c74c073a0573d94035d172969f86f31cf83365))

# [0.11.0](https://github.com/leogrigs/easy-budget/compare/v0.10.0...v0.11.0) (2024-10-25)


### Features

* **firebase:** entry creation integration ([576476e](https://github.com/leogrigs/easy-budget/commit/576476efffa80102fec25765c4e2548b2954d255))

# [0.10.0](https://github.com/leogrigs/easy-budget/compare/v0.9.0...v0.10.0) (2024-10-24)


### Bug Fixes

* **firebase:** remove comments and unused imports ([937b6af](https://github.com/leogrigs/easy-budget/commit/937b6af43bac019e6c9ba8d670cc828825ab20b3))
* svg properties ([699b390](https://github.com/leogrigs/easy-budget/commit/699b390cfea4341f901fdd7bc9c2b30e969cc0d1))


### Features

* **firebase:** persistency strategy ([5bb07ed](https://github.com/leogrigs/easy-budget/commit/5bb07ed3a11ea8d55697a6923f3bc00d0c3e1fd5))
* **firebase:** set up sign in google provider ([39b1b9e](https://github.com/leogrigs/easy-budget/commit/39b1b9e7fd92a1aedafe2542a1236be69c8dd9fd))

# [0.9.0](https://github.com/leogrigs/easy-budget/compare/v0.8.0...v0.9.0) (2024-10-23)


### Features

* **budget-table:** bullet indicator to entry type ([3172e46](https://github.com/leogrigs/easy-budget/commit/3172e4656b90a88ac4ee9867eaf436fcd65bbc3b))

# [0.8.0](https://github.com/leogrigs/easy-budget/compare/v0.7.0...v0.8.0) (2024-10-22)


### Features

* **paginator:** new paginator component ([fea7553](https://github.com/leogrigs/easy-budget/commit/fea7553e70e97f18563654599b1580dd78c761d2))
* **search:** search by name ([d60fddd](https://github.com/leogrigs/easy-budget/commit/d60fddd78fee737fe7eeb789b8af963ecb2969de))

# [0.7.0](https://github.com/leogrigs/easy-budget/compare/v0.6.0...v0.7.0) (2024-10-22)


### Features

* **totalizers:** new component to show totalizers ([d6bf7fb](https://github.com/leogrigs/easy-budget/commit/d6bf7fbe7d5d280ed56585253c5d6935fa6c6976))

# [0.6.0](https://github.com/leogrigs/easy-budget/compare/v0.5.0...v0.6.0) (2024-10-21)


### Bug Fixes

* category salary option label ([564909e](https://github.com/leogrigs/easy-budget/commit/564909e3be9fbca3728852e18e761b82306fb97d))


### Features

* **new-entry:** new entry POST API integration ([bc34884](https://github.com/leogrigs/easy-budget/commit/bc34884c8378068867a35fe3ffbe5a7284928b62))

# [0.5.0](https://github.com/leogrigs/easy-budget/compare/v0.4.0...v0.5.0) (2024-10-20)


### Features

* **new-entry:** included last fields on modal ([da5ac69](https://github.com/leogrigs/easy-budget/commit/da5ac697bf7714169e89f4942f24b3a23865d23e))
* select input component ([a469542](https://github.com/leogrigs/easy-budget/commit/a46954252d79e7db34ef629af69d17a5779b5f3e))

# [0.4.0](https://github.com/leogrigs/easy-budget/compare/v0.3.0...v0.4.0) (2024-10-19)


### Features

* **input:** new stylized input component ([090a565](https://github.com/leogrigs/easy-budget/commit/090a5652fb24a09871c6c21378db0e04bea11556))

# [0.3.0](https://github.com/leogrigs/easy-budget/compare/v0.2.0...v0.3.0) (2024-10-18)


### Features

* **new-entry-modal:** component creation and forms structure ([7a97d3c](https://github.com/leogrigs/easy-budget/commit/7a97d3cd7fb93dc0cf31c05fd27b94ab438f5276))

# [0.2.0](https://github.com/leogrigs/easy-budget/compare/v0.1.0...v0.2.0) (2024-10-18)


### Features

* include balance, income and expenses sums ([2712d9a](https://github.com/leogrigs/easy-budget/commit/2712d9a93bbbb89338c85cad90d3dfc44ebe4312))

# [0.1.0](https://github.com/leogrigs/easy-budget/compare/v0.0.2...v0.1.0) (2024-10-17)


### Features

* **budget-table:** sheet best api integration ([d92c90b](https://github.com/leogrigs/easy-budget/commit/d92c90b7ea2628296e87a06eba6514059e35ff13))
* **budgettable:** creating component and adding it to App.tsx ([c2f0233](https://github.com/leogrigs/easy-budget/commit/c2f023351c643d94de3dc1898676f073c8a5f3fe))
* **BudgetTable:** mocking first data ([7628cfd](https://github.com/leogrigs/easy-budget/commit/7628cfd3bbf7ff1dc0644bec82785c9874309d8e))
* print mock records on the screen ([6d87671](https://github.com/leogrigs/easy-budget/commit/6d876710e3673dc6dc450ca9a384206e340ca5f9))

## [1.0.1](https://github.com/leogrigs/easy-budget/compare/v1.0.0...v1.0.1) (2024-10-16)


### Bug Fixes

* project version ([4e6d6d3](https://github.com/leogrigs/easy-budget/commit/4e6d6d389a64abe833b6c0f606f3db4ff6065356))

# 0.0.1 (2024-10-15)

### Bug Fixes

- **Commitizen:** save release.yml ([0473ef8](https://github.com/leogrigs/easy-budget/commit/0473ef8495bcf024ac3697454a1a81520ad79303))
- rename release.config.js to release.config.cjs ([7be6ec6](https://github.com/leogrigs/easy-budget/commit/7be6ec6aedf110dabfb042fdd18b231d533202ac))
