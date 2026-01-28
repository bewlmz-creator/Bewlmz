import { Product } from './types';

export const DEFAULT_UPI_ID = "9316422604@ibl";

// Placeholder high-quality QR code data (This will be the default until admin replaces it)
export const DEFAULT_QR_CODE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA3pSURBVHgB7d07buNIFIDhfiv7LHQAFscY2TMAeS7E5pnoDpj7EG6fidsVyF0BvFaAeAHIFUB6BZkuIF6An88S6H9XV3XpBvSHTvL7A6re6uH7qOql+r9vXz7cf/n996/v9fJD77p+pPujrv969+rv3fhd398fdr3p9btuv+n6z5dvP/9p9fPkvvCbV39P/ev7Xp/f/XH169UfZ9//U/3p68e9r/fNf27f+P3M93Lpu77MNe3fv9/fL/6U9/pxuV3ej/t1uT29L66L97uT/57vca85f57r7nPdfT+u9+Xp7/Wp7+Xp99XvTz8vP88/p5/X98vP83v5N39vf6+u9+Xp+/S+5XO9/3x/fV6v9/Xp+8vP/d/D6/O+P+UfXHeff/67PMe9Pn3/vH/5Pq/X99P3V34P/9vX5/1+Xv9YvY7f66/rX9OPrp++v/I7Xff99PN8XP41v79+Tdfjevy+Xp/3f7e/Hvf3xfX9+vP++Prp+y6/43Pfz8/Xf+f38q/9/fXv9P3V9/f58/X96e/n3/M78vP8/vH983vO+8h75/fP+5e/3/8uz3Wvz388+bP3vT9P3+U9z2f6Ofd5n/Lp0/fH1++vX78//u/T93Ppe3++vOd/978v7/Hk83n//DznP9738f6+uD5/f+fvn/e8Lp/H6+u+98vfv7wf85nzPj75eTzXfP9/rO+H55/3P7+vz/PnvS7Pv++Xf873PPl8HOf3yX8v7/fX108f9/Nefx3/Xf9ePve85vvzvfC58p7n9eT3435+D8v74/O4X8e8Jz4vPr/X5f7ntZ/3eT9f/nO/P3497nvv533v98Pvjf9dfp/3OZ/7kvOfv8vnf+7P/X35z2eeP/v9yeeZ77v//eS9/HP++X2eeY/zO1m/9/M9uPycf53vve/Pf85rfp95z3P+6/t+Xp+fr399H++vX/r+zOf5OOf7nuv5PvveX96z+rO89r35zPOY78/zfX6eeZ/zmff7/Mfr9/6eeR/Lz3f/e8t7nt/P+fOf//257/M/8336vvp+vT+vL/+86+451/dzfX3e70/eN++L34+fcz2fz69Lzz3Py/v45fXp/Xm/+H5Pfp6+H0+ez9fXx897f1/8efqefC/v7zO/77M/zzzn03dy36+f8/3y7/O+v+/re/K/T5/v8z2/Z/5/uX8vP/983vye/Ln9eX9ef0+fz/X98v7m+p78mdfvL88p75vP4329Pvef3+f6/Lz7P3/X++HzzP2/vH7/3H/O5/X8Hpf79/y8/fX58P3y87xfXn+vfK+8z/3vy+v+/ph7vt7v98P36v359/P/5/3P76/fk99/30efb94Tv5f732vOY/p5POf5eP1zf/9/vr+/vMe/13f35Pq+/J78nv6098Pv6f398//M6/33+bzn98bv/339ef9yPv3c/l7/v3S75X3xWvO9/r0unz+k+vT8uPf8z7+/fT73O8n7/O+Pv+9XP+/vMblvea95vHq+5rXX17X78733/fpey7vz3/P3/U++l5/X94zr0+/3nL//877eH2ev8vvy+v7l/tT/n3e1/fL/F7e7/Je5//n/8773vv5P/f98nPf+8tr5j32zy///Nfc//xd74fPM/f/8vr9c/85n9fze1zu3/Pz9tfnw/fLz/N+ef298r3yPve/L6/7+zu5npt5z+/n6vvn/cv+9nPv8vD7n+Zyc+7m+Pv+f+30+n+XnmevTe/P++b1537z28vrfvNe8Ps+f5374vfJ9+Z+f39/nXN4Xvzc//+N98fnnvS+vy+//eS6f/8/rnX7fX5/+X66fLz/f3x9/8vP173mffX3O1fdP3vNf857n7/I5P9bzOef6/pTr+3m/vz7XU37K63N9P+f75Ov3+X0+9/3p/fD95Gv5eeYzn8f9On8/z/Xkz/fMef/m98779X3O+XOf81v/v74vfp/P7/28L/7f+PzO78P9O78HzzVf/znX9/n/6fP8Tvn/99fP9TznfD/8fH2fr+fP9Xf538uv5TX6z+37N7+X7/t9/X/L637++ZfPz/7/9fPv0/M/v8+/X8/vj1/O63P9/lO/Xn6f3689rf/78+7zn+Xq93vf6+uLzvM6//L7/vD6vn78rP/Of7/f9+uf/v899L/9+3/p6vf/+S9/H05P7uV3X/3V8T9e8/98j/f3+vz+fXvP3m//v969ee735++z+uTf79f/n/96///A6jQ0w/mBPrPAAAAAElFTkSuQmCC`;

export const TEXT_SLIDES = [
  "STEP 1: Choose your Plan (Plan A or Plan B) and get instant video access.",
  "STEP 2: Watch the step-by-step setup guides and launch your business from home.",
  "STEP 3: Start earning and scale your income up to 3 Lakh/Month with our proven ideas."
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'plan-a',
    name: 'Plan A',
    price: 999.00,
    description: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    longDescription: 'Plan A is a specialized blueprint focusing on a high-growth business model that you can start today. It includes 7 detailed modules designed for beginners.',
    features: [
      'Total Episode : 7',
      "No of Idea's : 1",
      'Earning Capacity : 15,000 to 1 Lakh/Month',
      'Stock : Only For 100 People'
    ],
    image: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRmNDZlNTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZTFiNGI7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZzEpIiAvPjxwYXRoIGQ9Ik0wIDQ1MCBRMjAwIDQwMCA0MDAgNDUwIFY2MDAgSDAgWiIgZmlsbD0iI2ZiYmYyNCIgb3BhY2l0eT0iMC4xIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmYW1pbHktc2VyaWY9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iNjAiIHN0eWxlPSJsZXR0ZXItc3BhY2luZzogLTJweDsiPlBMQU4gQTwvdGV4dD48cmVjdCB4PSIxMDAiIHk9IjE0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmJiZjI0Ii8+PHRleHQgeD0iMjAwIiB5PSIxOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmYmJmMjQiIGZhbWlseS1zZXJpZj0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxOCIgc3R5bGU9ImxldHRlci1zcGFjaW5nOiA0cHg7Ij5NQUNURVJZIENPVVJTRTwvdGV4dD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAsIDI1MCkiPjxwYXRoIGQ9Ik01MCAwIEwxMDAgODAgSDAgWiIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik01MCAyMCBMODAgODAgSDIwIFoiIGZpbGw9IiNmYmJmMjQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxMCIgZmlsbD0id2hpdGUiLz48L2c+PHRleHQgeD0iMjAwIiB5PSI0MjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmYW1pbHktc2VyaWY9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0="`,
    category: 'course',
    downloadUrl: '#'
  },
  {
    id: 'plan-b',
    name: 'Plan B',
    price: 1499.00,
    description: 'इस एक Idea से आपकी पूरी जिंदगी बदल जाएगी..!!',
    longDescription: 'Plan B is our most powerful success bundle with 3 recent high-potential business ideas for rapid growth. Ideal for those who can dedicate 2 hours daily.',
    features: [
      'Total Episode : 12 +',
      "No of Idea's : 3 (Recent)",
      'Earning Capacity : 25,000 to 3 Lakh/Month',
      'Time : Min. 2 Hour / Day'
    ],
    image: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNDAwIDYwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzdjM2FlZDtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0YzFkOTU7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZzIpIiAvPjXjaXJjbGUgY3g9IjQwMCIgY3k9IjAiIHI9IjIwMCIgZmlsbD0iI2ZiYmYyNCIgb3BhY2l0eT0iMC4xIi8+PHRleHQgeD0iMjAwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmYW1pbHktc2VyaWY9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtc2l6ZT0iNjAiIHN0eWxlPSJsZXR0ZXItc3BhY2luZzogLTJweDsiPlBMQU4gQjwvdGV4dD48cmVjdCB4PSIxMDAiIHk9IjE0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmJiZjI0Ii8+PHRleHQgeD0iMjAwIiB5PSIxOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmYmJmMjQiIGZhbWlseS1zZXJpZj0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxOCIgc3R5bGU9ImxldHRlci1zcGFjaW5nOiA0cHg7Ij5CVVNJTkVTUyBCVU5ETEU8L3RleHQ+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLCAyNTApIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik0zMCA1MCBMNTAgMzAgTDcwIDUwIEw1MCA3MCBaIiBmaWxsPSIjZmJiZjI0Ii8+PHBhdGggZD0iTTIwIDUwIEw1MCAyMCBMODAgNTAgTDUwIDgwIFoiIGZpbGw9IiNmYmJmMjQiIG9wYWNpdHk9IjAuNSIvPjwvZz48dGV4dCB4PSIyMDAiIHk9IjQyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZhbWlseS1zZXJpZj0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjgwMCIgZm9udC1zaXplPSIyNCI+MyBCVVNJTkVTUyBJREVBUzwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjQ2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIiBmYW1pbHktc2VyaWY9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZvbnQtc2l6ZT0iMTgiPjEyKyBFTElURSBFUElTT0RFUzwvdGV4dD48cmVjdCB4PSI1MCIgeT0iNTIwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNmYmJmMjQiLz48dGV4dCB4PSIyMDAiIHk9IjU0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzRjMWQ5NSI