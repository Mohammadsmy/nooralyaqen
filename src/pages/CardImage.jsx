// Full-screen 1080x1080 verse card for Instagram screenshot
// Usage: /card-image?i=0..44  OR  /card-image?a=arabic&e=english&r=ref&t=type

const LABELS   = { quran:'VERSE OF THE DAY', hadith:'HADITH OF THE DAY', dhikr:'DHIKR OF THE DAY', dua:'DUA OF THE DAY' }
const AR_LABEL = { quran:'آية اليوم', hadith:'حديث اليوم', dhikr:'ذكر اليوم', dua:'دعاء اليوم' }

const POSTS = [
  // ── Quran (original 5) ──────────────────────────────────────────────────────
  { type:'quran',  ar:'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا', en:'Whoever fears Allah, He will make a way out for him and provide from where he does not expect. And whoever relies upon Allah — then He is sufficient for him.', ref:'Al-Talaq 65:2-3' },
  { type:'quran',  ar:'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب', en:'Indeed, with hardship comes ease. Indeed, with hardship comes ease. So when you are free, strive hard. And to your Lord turn your attention.', ref:'Ash-Sharh 94:5-8' },
  { type:'quran',  ar:'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ', en:'When My servants ask about Me — I am near. I respond to the caller when he calls. So let them respond to Me and believe in Me, that they may be guided.', ref:'Al-Baqarah 2:186' },
  { type:'quran',  ar:'يَا بَنِيَّ اذْهَبُوا فَتَحَسَّسُوا مِن يُوسُفَ وَأَخِيهِ وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ', en:'O my sons, go and find out about Yusuf and his brother, and do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.', ref:'Yusuf 12:87' },
  { type:'quran',  ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَهُوَ الْعَلِيُّ الْعَظِيمُ', en:'Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and earth. His Kursi extends over the heavens and the earth, and their preservation tires Him not. He is the Most High, the Most Great.', ref:'Al-Baqarah 2:255 — Ayat al-Kursi' },
  // ── Hadith (original 5) ─────────────────────────────────────────────────────
  { type:'hadith', ar:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', en:'Actions are judged only by intentions, and each person will have only what they intended.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ وَفِي كُلٍّ خَيْرٌ', en:'The strong believer is better and more beloved to Allah than the weak believer, though both have goodness.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', en:'Whoever takes a path seeking knowledge, Allah will make easy for him the path to Paradise.', ref:'Sahih Muslim' },
  { type:'hadith', ar:'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', en:'Your smile in the face of your brother is charity.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', en:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.', ref:'Sahih al-Bukhari' },
  // ── Dhikr (original 5) ──────────────────────────────────────────────────────
  { type:'dhikr',  ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ۝ سُبْحَانَ اللَّهِ الْعَظِيمِ', en:'Glory be to Allah and His praise. Glory be to Allah the Magnificent.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', en:'None has the right to be worshipped but Allah alone. His is the dominion and all praise belongs to Him.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', en:'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.', ref:'Sayyid al-Istighfar — Sahih al-Bukhari' },
  { type:'dhikr',  ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en:'Allah is sufficient for us, and He is the best Disposer of affairs.', ref:'Al-Imran 3:173' },
  { type:'dhikr',  ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', en:'O Allah, I ask You for forgiveness and wellbeing in this world and the next.', ref:'Sunan Abu Dawud' },

  // ── Quran (new 15) ──────────────────────────────────────────────────────────
  { type:'quran',  ar:'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', en:'Remember Me, and I will remember you. Be grateful to Me and do not deny Me.', ref:'Al-Baqarah 2:152' },
  { type:'quran',  ar:'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en:'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.', ref:'Al-Baqarah 2:153' },
  { type:'quran',  ar:'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', en:'Indeed, to Allah we belong and to Him we shall return.', ref:'Al-Baqarah 2:156' },
  { type:'quran',  ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', en:'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.', ref:'Al-Baqarah 2:201' },
  { type:'quran',  ar:'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ', en:'Allah does not burden a soul beyond what it can bear. For it is what it has earned, and against it is what it has done wrong.', ref:'Al-Baqarah 2:286' },
  { type:'quran',  ar:'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', en:'Verily, in the remembrance of Allah do hearts find rest.', ref:"Ar-Ra'd 13:28" },
  { type:'quran',  ar:'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ', en:'If you are grateful, I will surely increase you in favor. But if you are ungrateful, indeed My punishment is severe.', ref:'Ibrahim 14:7' },
  { type:'quran',  ar:'إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', en:'When the youths took refuge in the cave and said: Our Lord, grant us mercy from Yourself and guide us in our affair.', ref:'Al-Kahf 18:10' },
  { type:'quran',  ar:'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', en:'My Lord, indeed I am in need of whatever good You would send down to me.', ref:'Al-Qasas 28:24' },
  { type:'quran',  ar:'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا ۝ وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا', en:'O you who have believed, remember Allah with much remembrance, and exalt Him morning and afternoon.', ref:'Al-Ahzab 33:41-42' },
  { type:'quran',  ar:'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ', en:'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.', ref:'Az-Zumar 39:53' },
  { type:'quran',  ar:'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ', en:'And your Lord says: Call upon Me, and I will respond to you.', ref:'Ghafir 40:60' },
  { type:'quran',  ar:'وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ وَيَعْلَمُ مَا تَفْعَلُونَ', en:'And it is He who accepts repentance from His servants and pardons misdeeds, and He knows what you do.', ref:'Ash-Shura 42:25' },
  { type:'quran',  ar:'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ ۝ وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', en:'Your Lord has not forsaken you, nor has He detested you. And the Hereafter is better for you than the first. And your Lord is going to give you, and you will be satisfied.', ref:'Ad-Duha 93:3-5' },
  { type:'quran',  ar:'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ ۝ الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ', en:'Did We not expand your breast for you, and remove from you your burden which had weighed upon your back, and raise high your repute?', ref:'Al-Inshirah 94:1-4' },

  // ── Hadith (new 10) ─────────────────────────────────────────────────────────
  { type:'hadith', ar:'الدُّعَاءُ هُوَ الْعِبَادَةُ', en:"Du'a (supplication) is worship.", ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ', en:'The best of people are those most beneficial to people.', ref:"Al-Mu'jam al-Awsat — al-Tabarani" },
  { type:'hadith', ar:'مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ', en:'Whoever does not thank people has not thanked Allah.', ref:'Sunan Abu Dawud' },
  { type:'hadith', ar:'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ', en:'Indeed, Allah is gentle and loves gentleness in all matters.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ', en:'Whoever fulfills the need of his brother, Allah fulfills his need.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ', en:'Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.', ref:'Sunan al-Tirmidhi' },
  { type:'hadith', ar:'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', en:'The strong man is not the one who wrestles others. The strong man is the one who controls himself when he is angry.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'إِنَّ مِنْ أَكْمَلِ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا', en:'The most complete of the believers in faith are those with the best character.', ref:'Sunan Abu Dawud' },
  { type:'hadith', ar:'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ', en:'Whoever wishes to have his provision expanded and his life extended, let him maintain the ties of kinship.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'لَا يَدْخُلُ الْجَنَّةَ مَنْ لَا يَأْمَنُ جَارُهُ بَوَائِقَهُ', en:'He will not enter Paradise whose neighbor is not safe from his evil.', ref:'Sahih Muslim' },

  // ── Dhikr (new 5) ───────────────────────────────────────────────────────────
  { type:'dhikr',  ar:'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', en:'I seek forgiveness from Allah the Magnificent, besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him.', ref:'Sunan al-Tirmidhi' },
  { type:'dhikr',  ar:'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَّجِيدٌ', en:'O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy and Glorious.', ref:'Sahih al-Bukhari' },
  { type:'dhikr',  ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', en:'There is no power and no strength except with Allah.', ref:'Sahih al-Bukhari & Muslim' },
  { type:'dhikr',  ar:'سُبْحَانَ اللَّهِ ۝ وَالْحَمْدُ لِلَّهِ ۝ وَلَا إِلَٰهَ إِلَّا اللَّهُ ۝ وَاللَّهُ أَكْبَرُ', en:'Glory be to Allah. Praise be to Allah. There is no god but Allah. Allah is the Greatest.', ref:'Sahih Muslim' },
  { type:'dhikr',  ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', en:'In the name of Allah, with whose name nothing can cause harm on earth or in the heavens. He is the All-Hearing, the All-Knowing.', ref:'Sunan Abu Dawud' },

  // ── New 10 (posts 45–54) ────────────────────────────────────────────────────
  { type:'quran',  ar:'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوْا وَّالَّذِينَ هُم مُّحْسِنُونَ', en:'Indeed, Allah is with those who fear Him and those who are doers of good.', ref:'An-Nahl 16:128' },
  { type:'quran',  ar:'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', en:'Blessed is He in whose hand is all sovereignty, and He is over all things competent.', ref:'Al-Mulk 67:1' },
  { type:'quran',  ar:'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', en:'O mankind, We created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous.', ref:'Al-Hujurat 49:13' },
  { type:'quran',  ar:'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَا أُفٍّ', en:'Your Lord has decreed that you worship none but Him, and that you be kind to parents. If one or both reach old age, do not say to them a word of disrespect.', ref:'Al-Isra 17:23' },
  { type:'quran',  ar:'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', en:'I did not create jinn and mankind except to worship Me.', ref:'Adh-Dhariyat 51:56' },
  { type:'hadith', ar:'عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ', en:'You must be truthful. Truthfulness leads to righteousness, and righteousness leads to Paradise.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا أَوْ يَزْرَعُ زَرْعًا فَيَأْكُلُ مِنْهُ طَيْرٌ أَوْ إِنْسَانٌ أَوْ بَهِيمَةٌ إِلَّا كَانَ لَهُ بِهِ صَدَقَةٌ', en:'No Muslim plants a tree or sows seeds and then a bird, human, or animal eats from it, except that it is counted as charity for him.', ref:'Sahih al-Bukhari' },
  { type:'hadith', ar:'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', en:'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.', ref:'Sahih al-Bukhari' },
  { type:'dua',   ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ', en:'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, from the burden of debt and the oppression of people.', ref:'Sahih al-Bukhari' },
  { type:'dhikr', ar:'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا', en:'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.', ref:'Sunan Abu Dawud' },
]

export default function CardImage() {
  const p = new URLSearchParams(window.location.search)

  let arabic, english, ref, type
  const idx = p.get('i')
  if (idx !== null) {
    const post = POSTS[parseInt(idx) % POSTS.length]
    arabic  = post.ar
    english = post.en
    ref     = post.ref
    type    = post.type
  } else {
    arabic  = p.get('a') || 'إِنَّ مَعَ الْعُسْرِ يُسْرًا'
    english = p.get('e') || 'Indeed, with hardship will be ease.'
    ref     = p.get('r') || 'Ash-Sharh 94:6'
    type    = p.get('t') || 'quran'
  }

  const label   = LABELS[type]   || LABELS.quran
  const arLabel = AR_LABEL[type] || AR_LABEL.quran
  const arSize  = arabic.length > 100 ? '38px' : arabic.length > 60 ? '46px' : '58px'
  const enSize  = english.length > 160 ? '26px' : english.length > 100 ? '30px' : '36px'

  return (
    <div style={{
      width: '1080px', height: '1080px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0d3d29',
      padding: '60px', boxSizing: 'border-box',
      position: 'relative',
    }}>

      {/* Card panel */}
      <div style={{
        width: '100%', display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '28px', padding: '56px 68px 52px',
        boxSizing: 'border-box',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f0b429', fontSize: '22px' }}>✨</span>
            <span style={{ color: '#f0b429', fontSize: '15px', fontWeight: 700, letterSpacing: '0.18em', fontFamily: 'sans-serif' }}>
              {label}
            </span>
          </div>
          <span style={{ color: '#f0b429', fontSize: '20px', fontFamily: "'Noto Naskh Arabic', 'Cairo', sans-serif", direction: 'rtl' }}>
            {arLabel}
          </span>
        </div>

        {/* Arabic text — full harakat, RTL, large */}
        {arabic && (
          <p style={{
            fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
            direction: 'rtl', textAlign: 'right',
            fontSize: arSize,
            color: '#ffffff', lineHeight: 2.1, fontWeight: 700,
            margin: '0 0 36px 0', padding: 0,
            unicodeBidi: 'embed',
          }}>
            {arabic}
          </p>
        )}

        {/* English */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: enSize,
          color: 'rgba(255,255,255,0.88)', fontStyle: 'italic',
          lineHeight: 1.7, margin: '0 0 32px 0', padding: 0,
        }}>
          "{english}"
        </p>

        {/* Reference */}
        <p style={{
          fontFamily: 'sans-serif', fontSize: '17px',
          color: '#f0b429', fontWeight: 600, letterSpacing: '0.06em',
          margin: 0, padding: 0,
        }}>
          — {ref}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: '42px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      }}>
        <span style={{ color: 'rgba(240,180,41,0.75)', fontSize: '13px', letterSpacing: '0.24em', fontWeight: 700, fontFamily: 'sans-serif' }}>
          ✦  NOOR AL-YAQEEN  ✦
        </span>
        <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', letterSpacing: '0.14em', fontFamily: 'sans-serif' }}>
          nooralyaqeen.vercel.app
        </span>
      </div>
    </div>
  )
}
