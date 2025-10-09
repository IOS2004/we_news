# API Call Protection Mechanisms

## Visual Guide to Preventing Circular Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                     WALLETCONTEXT PROTECTION                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   App Initializes    │
└──────────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │  isAuthenticated  │◄──────────────┐
   │     changes       │               │
   └───────┬───────────┘               │
           │                           │
           ▼                           │
   ┌───────────────────┐               │
   │ hasInitialized?   │               │
   └───────┬───────────┘               │
           │                           │
     ┌─────┴─────┐                     │
     │           │                     │
    Yes         No                     │
     │           │                     │
     │           ▼                     │
     │   ┌───────────────────┐         │
     │   │ fetchWalletData() │         │
     │   └───────┬───────────┘         │
     │           │                     │
     │           ▼                     │
     │   ┌───────────────────┐         │
     │   │  isFetchingRef?   │         │
     │   └───────┬───────────┘         │
     │           │                     │
     │     ┌─────┴─────┐               │
     │     │           │               │
     │    Yes         No               │
     │     │           │               │
     │     │           ▼               │
     │     │   ┌──────────────┐        │
     │     │   │  API CALL    │        │
     │     │   │ GET /wallet  │        │
     │     │   └──────┬───────┘        │
     │     │          │                │
     │     │          ▼                │
     │     │   ┌──────────────┐        │
     │     │   │ Set balance, │        │
     │     │   │ transactions │        │
     │     │   └──────┬───────┘        │
     │     │          │                │
     │     │          ▼                │
     │     │   ┌──────────────┐        │
     │     │   │hasInitialized│        │
     │     │   │   = true     │────────┘ ✅ Prevents future auto-calls
     │     │   └──────────────┘
     │     │
     │     ▼
     │  SKIP ✅ Already fetching
     │
     ▼
  SKIP ✅ Already initialized


═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                     ADD MONEY FLOW                               │
└─────────────────────────────────────────────────────────────────┘

  User Action (Button Click)
           │
           ▼
   ┌───────────────────┐
   │  handleAddMoney() │
   └───────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │  isProcessing?    │
   └───────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
    Yes         No
     │           │
     │           ▼
     │   ┌──────────────────┐
     │   │ setIsProcessing  │
     │   │    = true        │ ✅ Guard activated
     │   └────────┬─────────┘
     │            │
     │            ▼
     │   ┌──────────────────┐
     │   │   API CALL #1    │
     │   │ POST /topup      │
     │   └────────┬─────────┘
     │            │
     │            ▼
     │   ┌──────────────────┐
     │   │ Get transactionId│
     │   └────────┬─────────┘
     │            │
     │            ▼
     │   ┌──────────────────┐
     │   │  Open CashFree   │
     │   │   SDK (UI)       │
     │   └────────┬─────────┘
     │            │
     │            ▼
     │   ┌──────────────────┐
     │   │  User Completes  │
     │   │    Payment       │
     │   └────────┬─────────┘
     │            │
     │      ┌─────┴─────┐
     │      │           │
     │   Success     Failure
     │      │           │
     │      ▼           ▼
     │   ┌─────┐     ┌──────┐
     │   │onVer│     │onErr │
     │   │ify  │     │or    │
     │   └──┬──┘     └───┬──┘
     │      │            │
     │      ▼            │
     │   ┌──────────┐    │
     │   │ Refresh  │    │
     │   │ Wallet   │    │
     │   │ API #2   │    │
     │   └──────────┘    │
     │                   │
     │      ▼            ▼
     │   ┌──────────────────┐
     │   │ setIsProcessing  │
     │   │    = false       │ ✅ Guard released
     │   └──────────────────┘
     │
     ▼
  SKIP ✅ Already processing


═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                 PROTECTION LAYERS SUMMARY                        │
└─────────────────────────────────────────────────────────────────┘

Layer 1: hasInitialized Flag
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Prevents automatic re-initialization                       ║
║  ✅ Set once per authentication session                        ║
║  ✅ Survives component re-renders                             ║
╚═══════════════════════════════════════════════════════════════╝

Layer 2: isFetchingRef Lock
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Prevents concurrent API calls                             ║
║  ✅ Uses ref (no re-renders)                                  ║
║  ✅ Always released in finally block                          ║
╚═══════════════════════════════════════════════════════════════╝

Layer 3: Optimized Dependencies
╔═══════════════════════════════════════════════════════════════╗
║  ✅ useEffect depends on [isAuthenticated] only               ║
║  ✅ No user object in dependencies                            ║
║  ✅ No context values in dependencies                         ║
╚═══════════════════════════════════════════════════════════════╝

Layer 4: User Action Triggers
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Manual triggers only (button clicks, pull-to-refresh)     ║
║  ✅ No automatic triggers in add-money flow                   ║
║  ✅ Button disabled during processing                         ║
╚═══════════════════════════════════════════════════════════════╝

Layer 5: Single Callback Invocation
╔═══════════════════════════════════════════════════════════════╗
║  ✅ CashFree SDK guarantees single callback                   ║
║  ✅ No recursive calls in handlers                            ║
║  ✅ Navigation away prevents re-triggers                      ║
╚═══════════════════════════════════════════════════════════════╝


═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    API CALL TIMELINE                             │
└─────────────────────────────────────────────────────────────────┘

Time │ Event                          │ API Calls │ Total
─────┼────────────────────────────────┼───────────┼──────
0:00 │ App Start                      │     0     │   0
0:01 │ User Logs In                   │     0     │   0
0:02 │ WalletContext Initialize       │     1     │   1  ✅
0:03 │ Navigate to Wallet Screen      │     0     │   1
0:04 │ Leave Wallet Screen            │     0     │   1
0:05 │ Return to Wallet Screen        │     0     │   1  ✅ No re-fetch
0:10 │ Click "Add Money"              │     1     │   2  (POST /topup)
0:11 │ CashFree Payment UI Opens      │     0     │   2
0:15 │ User Completes Payment         │     0     │   2
0:16 │ Payment Success Callback       │     1     │   3  (GET /wallet)
0:17 │ Navigate Back to Wallet        │     0     │   3
0:30 │ Pull to Refresh                │     1     │   4  ✅ Manual only
1:00 │ Leave and Return Again         │     0     │   4  ✅ Still cached

Result: LINEAR growth, NO exponential calls ✅


═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│              WHAT WOULD CAUSE CIRCULAR DEPENDENCY?               │
│                    (All Avoided in Our Code)                     │
└─────────────────────────────────────────────────────────────────┘

❌ BAD: useEffect with user object dependency
┌─────────────────────────────────────────────────────────────┐
│ useEffect(() => {                                            │
│   fetchWallet();                                            │
│ }, [user]);  // ❌ User object changes trigger re-fetch     │
│                                                              │
│ Result: Login → Fetch → User updated → Fetch → User updated │
│         → Fetch... (INFINITE LOOP)                          │
└─────────────────────────────────────────────────────────────┘

❌ BAD: State update in fetch that triggers another fetch
┌─────────────────────────────────────────────────────────────┐
│ const fetchWallet = async () => {                           │
│   const data = await api.getWallet();                       │
│   setUser(data.user);  // ❌ Triggers user change           │
│ };                                                           │
│                                                              │
│ useEffect(() => {                                           │
│   fetchWallet();                                            │
│ }, [user]);  // ❌ Triggered by user change                 │
│                                                              │
│ Result: Fetch → Update user → Fetch → Update user... (LOOP) │
└─────────────────────────────────────────────────────────────┘

❌ BAD: Context update triggers component re-render
┌─────────────────────────────────────────────────────────────┐
│ // In Context:                                              │
│ setBalance(newBalance);  // ❌ Updates context              │
│                                                              │
│ // In Component:                                            │
│ useEffect(() => {                                           │
│   fetchWallet();                                            │
│ }, [balance]);  // ❌ Triggered by balance change           │
│                                                              │
│ Result: Fetch → Update balance → Fetch → Update... (LOOP)   │
└─────────────────────────────────────────────────────────────┘

✅ OUR SOLUTION: None of the above patterns exist in our code!


═══════════════════════════════════════════════════════════════════

                            SUMMARY

    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   ✅ NO CIRCULAR DEPENDENCIES                         ║
    ║   ✅ NO EXPONENTIAL API CALLS                         ║
    ║   ✅ ALL CALLS ARE INTENTIONAL & GUARDED             ║
    ║   ✅ PRODUCTION READY                                ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
```
