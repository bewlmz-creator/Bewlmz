import { Product } from './types';

export const DEFAULT_UPI_ID = "9316422604@ibl";

// Provided PhonePe QR Code (High Fidelity Data URI)
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
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234f46e5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e1b4b;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='600' fill='url(%23g1)' /%3E%3Cpath d='M0 450 Q200 400 400 450 V600 H0 Z' fill='%23fbbf24' opacity='0.1'/%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='900' font-size='60' style='letter-spacing: -2px;'%3EPLAN A%3C/text%3E%3Crect x='100' y='140' width='200' height='4' fill='%23fbbf24'/%3E%3Ctext x='200' y='190' text-anchor='middle' fill='%23fbbf24' font-family='sans-serif' font-weight='700' font-size='18' style='letter-spacing: 4px;'%3EMASTERY COURSE%3C/text%3E%3Cg transform='translate(150, 250)'%3E%3Cpath d='M50 0 L100 80 H0 Z' fill='white' opacity='0.2'/%3E%3Cpath d='M50 20 L80 80 H20 Z' fill='%23fbbf24'/%3E%3Ccircle cx='50' cy='50' r='10' fill='white'/%3E%3C/g%3E%3Ctext x='200' y='420' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='800' font-size='24'%3E1 IDEAS%3C/text%3E%3Ctext x='200' y='460' text-anchor='middle' fill='rgba(255,255,255,0.6)' font-family='sans-serif' font-weight='600' font-size='18'%3E7 POWERFUL EPISODES%3C/text%3E%3C/svg%3E`,
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
    image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%237c3aed;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234c1d95;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='600' fill='url(%23g2)' /%3E%3Ctext x='200' y='120' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='900' font-size='60' style='letter-spacing: -2px;'%3EPLAN B%3C/text%3E%3Crect x='100' y='140' width='200' height='4' fill='%23fbbf24'/%3E%3Ctext x='200' y='190' text-anchor='middle' fill='%23fbbf24' font-family='sans-serif' font-weight='700' font-size='18' style='letter-spacing: 4px;'%3EBUSINESS BUNDLE%3C/text%3E%3Cg transform='translate(150, 250)'%3E%3Ccircle cx='50' cy='50' r='40' fill='white' opacity='0.1'/%3E%3Cpath d='M30 50 L50 30 L70 50 L50 70 Z' fill='%23fbbf24'/%3E%3C/g%3E%3Ctext x='200' y='420' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='800' font-size='24'%3E3 BUSINESS IDEAS%3C/text%3E%3Ctext x='200' y='460' text-anchor='middle' fill='rgba(255,255,255,0.6)' font-family='sans-serif' font-weight='600' font-size='18'%3E12+ ELITE EPISODES%3C/text%3E%3C/svg%3E`,
    category: 'course',
    downloadUrl: '#'
  }
];

// Precise recreation of the user's provided green/white marketing banner as a URL-encoded string for maximum safety
export const HERO_BANNER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='500' viewBox='0 0 1200 500'%3E%3Crect width='1200' height='500' fill='white'/%3E%3Ctext x='80' y='80' fill='%232d5a27' font-family='sans-serif' font-weight='900' font-size='48'%3ESet Up This Business %26 Earn%3C/text%3E%3Ctext x='140' y='145' fill='%232d5a27' font-family='sans-serif' font-weight='900' font-size='48'%3EUpto 1.5 Lakh/Month.%3C/text%3E%3Cpath d='M80 190 H580 Q680 190 680 320 Q680 450 580 450 H80 Z' fill='black'/%3E%3Ctext x='110' y='250' font-family='sans-serif' font-weight='700' font-size='28'%3E%3Ctspan fill='%23f6bd60'%3EStep 1 ~ %3C/tspan%3E%3Ctspan fill='white'%3EBuy This Video Cource.%3C/tspan%3E%3C/text%3E%3Ctext x='110' y='310' font-family='sans-serif' font-weight='700' font-size='28'%3E%3Ctspan fill='%23f6bd60'%3EStep 2 ~ %3C/tspan%3E%3Ctspan fill='white'%3EWatch Full Video %26 S Setup%3C/tspan%3E%3C/text%3E%3Ctext x='230' y='350' fill='white' font-family='sans-serif' font-weight='700' font-size='28'%3Eyour Business Step By Step.%3C/text%3E%3Ctext x='110' y='410' font-family='sans-serif' font-weight='700' font-size='28'%3E%3Ctspan fill='%23f6bd60'%3EStep 3 ~ %3C/tspan%3E%3Ctspan fill='white'%3EEarn Upto 1.5 Lakh Per%3C/tspan%3E%3C/text%3E%3Ctext x='230' y='450' fill='white' font-family='sans-serif' font-weight='700' font-size='28'%3EMonth.%3C/text%3E%3Cg transform='translate(750, 100)'%3E%3Cpath d='M50 50 Q150 0 250 50 Q350 150 250 300 Q150 350 50 300 Z' fill='%23ff8c61' opacity='0.8'/%3E%3Crect x='20' y='60' width='300' height='200' rx='10' fill='white' stroke='%236366f1' stroke-width='4'/%3E%3Crect x='50' y='90' width='100' height='140' fill='%23f0fdf4' stroke='%234ade80' stroke-width='2'/%3E%3Ctext x='100' y='130' text-anchor='middle' font-size='14' font-weight='bold' fill='%232d5a27'%3EYOUR%3C/text%3E%3Ctext x='100' y='160' text-anchor='middle' font-size='16' font-weight='bold' fill='%23f28482'%3ESUCCESS%3C/text%3E%3Ctext x='100' y='190' text-anchor='middle' font-size='14' font-weight='bold' fill='%232d5a27'%3EE-BOOK%3C/text%3E%3Crect x='250' y='0' width='100' height='40' rx='12' fill='%236a994e'/%3E%3Ctext x='300' y='25' text-anchor='middle' fill='white' font-weight='bold' font-size='16'%3EDigital%3C/text%3E%3Crect x='280' y='60' width='110' height='40' rx='12' fill='%236a994e'/%3E%3Ctext x='335' y='85' text-anchor='middle' fill='white' font-weight='bold' font-size='16'%3EProducts%3C/text%3E%3C/g%3E%3C/svg%3E`;
