/* ============================================================
   data.js — everything on the site is generated from this file.
   To add a publication: copy a line, change the fields.
     t   kind: article | chapter | review | working | public
     th  theme: mig | sec | fpc | ped
     url paste a DOI or article link between the quotes; a
         "Read" link appears automatically once it is filled in
   ============================================================ */
const ME="Obaidullah, Md.";
const THEMES=[
  {k:"mig",label:"Migration, refugees, and borders",c:"#8a3324",
   blurb:"The Rohingya crisis and its effect on Bangladesh–Myanmar relations, the India–Bangladesh border, and irregular Bangladeshi migration to Europe and the Gulf."},
  {k:"sec",label:"International conflict and security",c:"#2f6465",
   blurb:"A master's thesis on diversionary repression in electoral autocracies, with current work on Bangladesh's July 2024 uprising and the external patronage that preceded it."},
  {k:"fpc",label:"Foreign policy and great power competition",c:"#3d4f8a",
   blurb:"Belt and Road implementation and Chinese soft power in Bangladesh and Pakistan, Qatar's hedging between Washington and Beijing, and comparative US–China influence in South Asia."},
  {k:"ped",label:"Political economy and development",c:"#63723b",
   blurb:"Fieldwork-based studies of informal labour, health access, and household vulnerability in urban and riverine Bangladesh, and the trade politics that shape them."}
];
const TCOLOR=Object.fromEntries(THEMES.map(t=>[t.k,t.c]));

const DATA=[
 {t:"article",url:"",y:2026,th:"sec",title:"Machiavellian and Hobbesian Foundations of Democratic Decline in Bangladesh",venue:"Contemporary South Asia",detail:"pp. 1–26",authors:[ME],solo:true,geo:["BD"]},
 {t:"article",url:"",y:2026,th:"fpc",title:"Delivering Attraction? How BRI Implementation Shapes China’s Soft Power in Bangladesh and Pakistan",venue:"China Report",detail:"62(2), 257–277",authors:[ME],solo:true,geo:["CN","BD","PK"]},
 {t:"article",url:"",y:2026,th:"fpc",title:"Choosing Not to Choose: Qatar’s Hedging in the U.S.–China Rivalry",venue:"Journal of Countries Studies",detail:"4(2), 335–371",authors:[ME],solo:true,geo:["QA","US","CN"]},
 {t:"article",url:"",y:2025,th:"fpc",title:"Assessing Geopolitical and Socio-economic Consequences of India–Bangladesh Water Disputes",venue:"Discover Global Society",detail:"3(1)",authors:[ME,"M. R. Howlader"],geo:["IN","BD"]},
 {t:"article",url:"",y:2025,th:"mig",title:"Beyond Borders: Mapping Out the Difficulties, Stress, and Coping Strategies in Transnational Irregular (Illegal) Labor Migration from Bangladesh",venue:"International Journal of Community Well-Being",detail:"",authors:["M. S. Sohel","M. K. Sifullah","N. T. Zaman","B. Hossain",ME],geo:["BD","QA"]},
 {t:"article",url:"",y:2025,th:"ped",title:"WASH Service Accessibility and Satisfaction among Street Informal Workers in Dhaka City: A Cross-Sectional Study",venue:"Discover Social Science and Health",detail:"5, 45",authors:["M. K. Sifullah","M. S. Sohel","S. Jamil","B. Ahmad","M. A. Hossain",ME,"N. T. Zaman","O. Faruk","M. T. Islam","N. Ali"],geo:["BD"]},
 {t:"article",url:"",y:2024,th:"mig",title:"From Humanitarian Crisis to Burden: Understanding the Rohingya Refugee Crisis in Bangladesh",venue:"SN Social Sciences",detail:"4(8)",authors:[ME,"M. Hossain","M. S. Raihan","M. S. Hossen"],geo:["MM","BD"]},
 {t:"article",url:"",y:2024,th:"mig",title:"Exploring Risky Health Behaviors and Vulnerability to Sexually Transmitted Diseases among Transnational Undocumented Labor Migrants from Bangladesh: A Qualitative Study",venue:"BMC Public Health",detail:"24(1)",authors:["M. S. Sohel","M. K. Sifullah","B. Hossain","M. F. H. Sarker","N. T. Zaman",ME],geo:["BD","QA"]},
 {t:"article",url:"",y:2024,th:"ped",title:"Navigating Vulnerabilities: The Untold Story of Informal Households in Dhaka, Bangladesh during the COVID-19 Pandemic",venue:"New Zealand Journal of Asian Studies",detail:"26(2), 75–98",authors:["M. M. Begum Mamy",ME,"N. T. Zaman","M. K. Saifullah","M. S. Sohel","M. Hossen","G. A. Horaira"],geo:["BD"]},
 {t:"article",url:"",y:2024,th:"ped",title:"Exploring the Multifaceted Vulnerabilities of Female Street Child Labor in the Capital City of Bangladesh",venue:"Heliyon",detail:"e37302",authors:["M. S. Sohel","S. Alam","M. M. Rahman",ME,"A. A. S. M. Towhidul","M. B. Hossain","M. A. Hossain"],geo:["BD"]},
 {t:"article",url:"",y:2024,th:"ped",title:"Healthcare Challenges in Disaster-Prone Riverine Islands: A Study of Sirajganj, Bangladesh",venue:"International Journal of Community Well-Being",detail:"",authors:["M. S. Sohel","S. Jamil",ME,"B. Hossain","H. M. Ali","M. S. Hossen","M. S. Uddin","T. Ahsan","N. F. Eva"],geo:["BD"]},
 {t:"article",url:"",y:2024,th:"ped",title:"Is E-business Breaking Down Barriers for Bangladesh’s Young Female Entrepreneurs during the COVID-19 Pandemic? A Qualitative Study",venue:"SN Social Sciences",detail:"4(6)",authors:["M. F. H. Sarker","S. F. Ahmed","U. Kawser","M. S. Hossen",ME,"S. Khan","M. K. Sifullah","M. S. Sohel"],geo:["BD"]},
 {t:"article",url:"",y:2023,th:"ped",title:"Unusual Increase of Cesarean Section Delivery in Bangladesh: Correspondence",venue:"Annals of Medicine and Surgery",detail:"85(5)",authors:["S. Jamil",ME,"M. Alam"],geo:["BD"]},
 {t:"article",url:"",y:2023,th:"ped",title:"Burning Up: How Heatwaves Pose a Threat to Public Health",venue:"International Journal of Surgery: Short Reports",detail:"8(3)",authors:[ME,"S. Jamil","A. H. Mohammad","A. Akhter"],geo:["BD"]},

 {t:"chapter",url:"",y:2025,th:"fpc",title:"China’s Soft Power Strategy in the Middle East and East Asia: A Comparative Analysis",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Ed. A. A. Ullah. Springer",authors:[ME,"M. Hossain"],geo:["CN","QA"]},
 {t:"chapter",url:"",y:2025,th:"mig",title:"The Rohingya Crisis and Its Effect on Bangladesh–Myanmar Bilateral Relations: A Historical Analysis",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Ed. A. A. Ullah. Springer",authors:[ME,"R. Begum"],geo:["MM","BD"]},
 {t:"chapter",url:"",y:2025,th:"fpc",title:"China’s Diplomatic Approach to the Rohingya Crisis: Balancing Economic Interests and Humanitarian Concerns",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Ed. A. A. Ullah. Springer",authors:["M. Hossain",ME],geo:["CN","MM","BD"]},
 {t:"chapter",url:"",y:2025,th:"mig",title:"Bangladeshi Undocumented Migration Crisis in Europe: Implications for Security, Human Rights, and Policy",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Springer",authors:["M. S. Sohel","M. A. Hossain","M. F. H. Sarker","M. K. Sifullah",ME,"A. A. Ullah"],geo:["BD","EU"]},
 {t:"chapter",url:"",y:2025,th:"mig",title:"Security Questions Explained: Irregular Migrants to Europe",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Springer",authors:["M. S. Sohel","M. K. Sifullah","M. F. H. Sarker","M. A. Hossain",ME],geo:["BD","EU"]},
 {t:"chapter",url:"",y:2024,th:"fpc",title:"Major Powers’ Approaches to the Rohingya Crisis and Their Impact on Bangladesh",venue:"Handbook of Migration, International Relations and Security in Asia",detail:"Ed. A. A. Ullah. Springer",authors:[ME,"M. Hossain"],geo:["MM","BD","CN","US"]},
 {t:"chapter",url:"",y:2024,th:"fpc",title:"Soft Power Competition: A Comparative Analysis of China and the United States in South Asia",venue:"Soft Power and Diplomatic Strategies in Asia and the Middle East",detail:"Ed. M. Zreik. IGI Global",authors:[ME,"M. S. Raihan"],geo:["CN","US","BD"]},

 {t:"review",url:"",y:2025,th:"fpc",title:"Power of Bonding and Non-Western Soft Power Strategy in Iran: Comparing China and India’s Engagement",venue:"Contemporary South Asia",detail:"33(1), 145–146",authors:["M. Hossain",ME],geo:["CN","IN"]},
 {t:"review",url:"",y:2024,th:"sec",title:"We Had the Watches. They Had the Time: A Witness Account of the War in Afghanistan",venue:"Small Wars & Insurgencies",detail:"pp. 1–3",authors:["M. Hossain",ME],geo:["US","PK"]},
 {t:"review",url:"",y:2023,th:"mig",title:"Rohingya Refugee Crisis in Myanmar: Ethnic Conflict and Resolution, eds. Bulbul, Islam, and Khan",venue:"Society and Culture in South Asia",detail:"",authors:[ME,"M. Hossain"],geo:["MM","BD"]},

 {t:"working",url:"",y:2026,th:"sec",title:"Regime Collapse without Civil War: Explaining Bangladesh’s July 2024 Uprising",venue:"Revise and resubmit",detail:"",authors:[ME],solo:true,flag:"R&R",geo:["BD"]},
 {t:"working",url:"",y:2025,th:"sec",title:"India’s Influence on Authoritarianism in South Asia: The Case of Sheikh Hasina’s Bangladesh (2009–2024)",venue:"Under review",detail:"",authors:[ME],solo:true,flag:"Under review",geo:["IN","BD"]},

 {t:"public",url:"",y:2026,th:"mig",title:"The Border Killing Fields Separating India and Bangladesh",venue:"Asia Times",detail:"",authors:[ME],solo:true,geo:["IN","BD"]},
 {t:"public",url:"",y:2026,th:"fpc",title:"Invisible Diplomats",venue:"New Age",detail:"",authors:[ME],solo:true,geo:["BD"]},
 {t:"public",url:"",y:2026,th:"sec",title:"What If Iran’s Next Target Is the Gulf’s Water Supply?",venue:"Asia Times",detail:"",authors:[ME],solo:true,geo:["QA"]},
 {t:"public",url:"",y:2026,th:"fpc",title:"China Quietly Eclipsing a Weakened Russia in Central Asia",venue:"Asia Times",detail:"",authors:[ME],solo:true,geo:["CN"]},
 {t:"public",url:"",y:2026,th:"fpc",title:"Bangladesh First: BNP’s Path to a Winning Foreign Policy",venue:"Asia Times",detail:"",authors:[ME,"A. Zobayer"],geo:["BD"]},
 {t:"public",url:"",y:2026,th:"ped",title:"Why the EU–India Trade Deal Could Be Bad News for Bangladesh",venue:"The Diplomat",detail:"",authors:[ME],solo:true,geo:["EU","IN","BD"]},
 {t:"public",url:"",y:2026,th:"fpc",title:"Why China and Russia Blinked as the United States Moved on Venezuela",venue:"Asia Times",detail:"",authors:[ME],solo:true,geo:["CN","US"]},
 {t:"public",url:"",y:2025,th:"fpc",title:"CPEC’s Afghan Push Poses a New Challenge for India",venue:"East Asia Forum",detail:"",authors:[ME],solo:true,geo:["CN","PK","IN"]},
 {t:"public",url:"",y:2025,th:"sec",title:"Turkey–Bangladesh Air Defense Deal Jolts South Asia’s Skies",venue:"Asia Times",detail:"",authors:[ME],solo:true,geo:["BD"]},
 {t:"public",url:"",y:2025,th:"mig",title:"Rohingya Crisis Demands More Than Paper Promises",venue:"New Age",detail:"",authors:[ME],solo:true,geo:["MM","BD"]},
 {t:"public",url:"",y:2025,th:"mig",title:"India and Bangladesh in a Crucial Test of Trust over the Border",venue:"Asia Times",detail:"",authors:["M. Hossain",ME],geo:["IN","BD"]},
 {t:"public",url:"",y:2025,th:"sec",title:"India’s Opposition to Bangladesh’s Defense Modernization Is a Self-Defeating Strategy",venue:"The Diplomat",detail:"",authors:[ME],solo:true,geo:["IN","BD"]},
 {t:"public",url:"",y:2025,th:"fpc",title:"Will Trump 2.0 End the Liberal International Order?",venue:"The Daily Star",detail:"",authors:["K. U. Mahmud",ME],geo:["US"]}
];

const KINDS=[{k:"all",label:"All"},{k:"article",label:"Journal articles"},{k:"chapter",label:"Book chapters"},{k:"review",label:"Book reviews"},{k:"working",label:"Working papers"},{k:"public",label:"Public writing"}];
const PLACES={
  US:{name:"United States",lon:-77.0,lat:38.9,la:"start",dx:18,dy:6},
  EU:{name:"Europe",lon:4.35,lat:50.85,la:"start",dx:18,dy:6},
  QA:{name:"Gulf states",lon:51.5,lat:25.3,la:"middle",dx:0,dy:34},
  PK:{name:"Pakistan",lon:73.1,lat:33.7,la:"middle",dx:0,dy:-20},
  IN:{name:"India",lon:77.2,lat:28.6,la:"end",dx:-20,dy:5},
  BD:{name:"Bangladesh",lon:90.4,lat:23.8,la:"end",dx:-28,dy:36},
  MM:{name:"Myanmar",lon:96.0,lat:21.0,la:"start",dx:22,dy:10},
  CN:{name:"China",lon:116.4,lat:39.9,la:"end",dx:-24,dy:5}
};
const REVIEWS=[["BMC Public Health",3],["SN Social Sciences",2],["International Journal of Community Well-Being",2],["International Journal of Sociology and Social Policy",2],["PLOS ONE",1],["PLOS Global Public Health",1],["International Journal of Water Resources Development",1],["Southeast Asia: A Multidisciplinary Journal",1],["Cogent Social Sciences",1]];
