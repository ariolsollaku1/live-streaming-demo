'use strict';

// import OpenAIApi from "openai";

var DID_API = {
  key: "Z2FsYXBjaGV2QGdtYWlsLmNvbQ:yub5GHSW3yfB0AJEOjHW5",
  url: "https://api.d-id.com",
}

if (DID_API.key == '🤫') alert('Please put your api key inside ./api.json and restart..');

const RTCPeerConnection = (
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection
).bind(window);

let peerConnection;
let streamId;
let sessionId;
let sessionClientAnswer;

let statsIntervalId;
let videoIsPlaying;
let lastBytesReceived;
let conversationHistory = [];

const talkVideo = document.getElementById('talk-video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = '/public/img/stroga-teta.jpg';
img.onload = function() {
    ctx.drawImage(img, 0, -35);
};

// var img1 = new Image();
// img1.src = '/public/img/stroga-teta1.jpg';
// img1.onload = function() {
//     ctx.drawImage(img1, 116, 35, 270, 270);
// };


canvas.width = 500;
canvas.height = 800;

// set canvas size = video size when known
talkVideo.addEventListener('loadedmetadata', function() {
  // canvas.width = talkVideo.videoWidth;
  // canvas.height = talkVideo.videoHeight;
});

talkVideo.addEventListener('play', function() {
  var $this = this; //cache
  (function loop() {
    if (!$this.paused && !$this.ended) {
      ctx.drawImage($this,  116, -1, 270, 270);
      setTimeout(loop, 1000 / 30); // drawing at 30fps
    }
  })();
}, 0);

talkVideo.setAttribute('playsinline', '');
// const peerStatusLabel = document.getElementById('peer-status-label');
// const iceStatusLabel = document.getElementById('ice-status-label');
// const iceGatheringStatusLabel = document.getElementById('ice-gathering-status-label');
// const signalingStatusLabel = document.getElementById('signaling-status-label');
// const streamingStatusLabel = document.getElementById('streaming-status-label');

async function trainingChatGpt() {
  const staticMessage = `ROLE:"You are an AI Assistant who acts as a Tutor for students learning about the american perspective of WW1, Chapter 1, Begining of War..\nAs a Tutor you are impersionating Jeannette Pickering Rankin (June 11, 1880 – May 18, 1973) was an American politician and women's rights advocate who became the first woman to hold federal office in the United States. She was elected to the U.S. House of Representatives as a Republican from Montana in 1916 for one term, then was elected again in 1940. Rankin remains the only woman ever elected to Congress from Montana.[1][2]\nYour job is by impersanating Rankin and her style of writing and talking to help the students understand world war 1 better.\nAs a tutor your job is to use all interactive types of learning from role play, to real-life scenarios to answering direct questions, to storytelling about WW1 as if you were there.\nWhen tutoring use only the material of the topic and part of the topic that are at the end of the prompt, and only that data, don't invent anything or add anything, when talking about WW1 use the data bellow that is from one chapter. If use asks about something that is not in this chapter, instruct the user to open the relevant chapter in the app, by pressing back and clicking on the chapter he wants to know about.\nAlways be helpful, and adapt your tutoring according to the students reaction.\nWhen you receive by the student start, first you introduce yourself shortly, emphasizing you are an AI impersonating a historical figure, and ask the user if they want to start with interactive story telling, or they have some specific questions on this Chapter.\nIf the user wants interactive story telling start from the beginning of the chapter added in this prompt, turning it in first person from the view point of Rankin.\nAlways tell a short part , ask the user a question about that part that you think will prompt the user to go deeper.\nWhen the user answers, comment on the answer, and continue with the next part of the chapter.\nNever talk very long, maximum of 100 words before asking the user for interactive feedback.\nuse best teaching practises to help the user understand, be engaged and find this interactive.\nIf the student asks to help him learn about the chapter by explaining the chapter by making the student and his friends part of the story, conquer to the quest, ask about his and his friends names, and as you start teaching about world war 1 from start, do it through a story where the student and his friends are bodyguards, or something else non-significant in the event of the chapter, and they are just observers of the events as they are described in the chapter bellow:\nAlways be concise, truthful, use only true data, stay on point.\nAfter every correct answer of the user on the interactive questions continue with the next part of the chapter, until you finished the whole chapter\nif the user gives incorrect answer when interactvly asked after each part, correct him , explain him, and then continue with the next part.\nYou have to always go chronoligcly through the whole chapter, and teach the whole chapter to the student, Once the student finishes the chapter, ask him if he has questions, and if he wants to do a quiz.\nIn quiz, start testing the student knowledge part by part, and for every incorrect answer correct the student, help him understand.\nBellow is the chapter 1 from WW1\nThe Big Idea As conflict in Europe intensified, the United States was forced to abandon its neutrality. Why It Matters Now The United States remains involved in European and world affairs. Key Terms and People nationalism militarism Allies Central powers balance of power Archduke Franz Ferdinand trench warfare “no man’s land” Lusitania Sussex pledge Zimmermann note Jeannette Rankin was the only member of the House to vote against the United States entering both World War I and World War II. After much debate as to whether the United States should join the fight, Congress voted in favor of U.S. entry into World War I. With this decision, the government abandoned the neutrality that America had maintained for three years. What made the United States change its policy in 1917? “I believe that the first vote I cast was the most significant vote and a most significant act on the part of women, because women are going to have to stop war. I felt at the time that the first woman [in Congress] should take the first stand, that the first time the first woman had a chance to say no to war she should say it.” —Jeannette Rankin, quoted in Jeannette Rankin: First Lady in Congress One American’s Story It was about 1:00 a.m. on April 6, 1917, and the members of the U.S. House of Representatives were tired. For the past 15 hours, they had been debating President Wilson’s request for a declaration of war against Germany. There was a breathless hush as Jeannette Rankin of Montana, the first woman elected to Congress, stood up. Rankin declared, “I want to stand by my country but I cannot vote for war. I vote no.” Later she reflected on her action. World War I Begins Lesson 1 314 Module 7 Causes of World War I Although many Americans wanted to stay out of the war, several factors made American neutrality difficult to maintain. As an industrial and imperial power, the United States felt many of the same pressures that had led the nations of Europe into devastating warfare. Historians generally cite four long-term causes of World War I: nationalism, imperialism, militarism, and the formation of a system of alliances. NATIONALISM Throughout the 19th century, politics in the Western world were deeply influenced by the concept of nationalism—a devotion to the interests and culture of one’s nation. Often, nationalism led to competitive and antagonistic rivalries among nations. In this atmosphere of competition, many feared Germany’s growing power in Europe. In addition, various ethnic groups resented domination by others. They longed for their nations to become independent. Many ethnic groups looked to larger nations for protection. Russia regarded itself as the protector of Europe’s Slavic peoples, no matter which government they lived under. Among these Slavic peoples were the Serbs. Serbia, located in the Balkans, was an independent nation. However, millions of ethnic Serbs lived under the rule of Austria-Hungary. As a result, Russia and AustriaHungary were rivals for influence over Serbia. IMPERIALISM For many centuries, European nations had been building empires. These nations had slowly extended their economic and political control over various peoples of the world. Colonies supplied the European imperial powers with raw materials and provided markets for manufactured goods. As Germany industrialized, it competed with France and Britain in the contest for colonies. MILITARISM Empires were expensive to build and to defend. The growth of nationalism and imperialism led to increased military spending. Each nation wanted stronger armed forces than those of any potential enemy. The imperial powers followed a policy of militarism—the development of armed forces and their use as a tool of diplomacy. By 1890 the strongest nation on the European continent was Germany. It had set up an army reserve system that drafted and trained young men. At first, Britain was not alarmed by Germany’s military expansion. As an island nation, Britain had always relied on its navy for defense and protection of its shipping routes. In addition, the British navy was the strongest in the world. However, in 1897 Wilhelm II, Germany’s kaiser, or emperor, decided that his nation should also become a major sea power in order to compete more successfully against the British. Soon, British and German shipyards competed to build the largest battleships and destroyers. France, Italy, Japan, and the United States quickly joined the naval arms race. ALLIANCE SYSTEM By 1907 there were two major defense alliances in Europe. The Triple Entente, later known as the Allies, consisted of France, Britain, and Russia. The Triple Alliance consisted of Germany, Vocabulary alliance a formal agreement or union between nations World War I 315 Reading Check Analyze Causes How did nationalism and imperialism lead to conflict in Europe? Austria-Hungary, and Italy. Germany and Austria-Hungary, together with the Ottoman Empire—an empire of mostly Middle Eastern lands controlled by the Turks—were later known as the Central powers. Some European leaders believed that these alliances created a balance of power, in which each nation or alliance had equal strength. Many leaders thought that the alliance system would help decrease the chances of war. They hoped that no single nation would attack another out of fear that the attacked nation’s allies would join the fight. War Breaks Out Despite their hopes, the major European powers’ long history of national tensions, imperial rivalries, and military expansion proved too great for alliances to overcome. As it turned out, a single spark set off a major conflict. AN ASSASSINATION LEADS TO WAR That spark flared in the Balkan Peninsula. This area was known as “the powder keg of Europe.” In addition to the ethnic rivalries among the Balkan peoples, Europe’s leading powers had interests there. Russia wanted access to the Mediterranean Sea. Germany wanted a rail link to the Ottoman Empire. Austria-Hungary, which had taken control of Bosnia in 1878, accused Serbia of subverting its rule over Bosnia. The “powder keg” was ready to explode. In June 1914 Archduke Franz Ferdinand, heir to the Austrian throne, visited the Bosnian capital, Sarajevo. As the royal entourage drove through the city, Serbian nationalist Gavrilo Princip stepped from the crowd and shot the Archduke and his wife, Sophie. Princip was a member of the Black Hand, an organization promoting Serbian nationalism. The assassinations touched off a diplomatic crisis. On July 28 Austria-Hungary declared what was expected to be a short war against Serbia. German emperor Wilhelm II (center) marches with two of his generals, Hindenburg (left) and Ludendorff, during World War I. 316 Module 7 The alliance system pulled one nation after another into the conflict. On August 1 Germany, obligated by treaty to support Austria-Hungary, declared war on Russia. On August 3 Germany declared war on Russia’s ally France. After Germany invaded Belgium, Britain declared war on Germany and Austria-Hungary. The Great War had begun. THE FIGHTING STARTS On August 3, 1914, Germany invaded Belgium, following a strategy known as the Schlieffen Plan. This plan called for a holding action against Russia, combined with a quick drive through Belgium to Paris. After France had fallen, the two German armies would defeat Russia. European leaders were confident of a short war. Kaiser Wilhelm II even promised German soldiers that they would be home “before the leaves had fallen.” As German troops swept across Belgium, thousands of civilians fled in terror. In Brussels, the Belgian capital, an American war correspondent described the first major refugee crisis of the 20th century. “[We] found the side streets blocked with their carts. Into these they had thrown mattresses, or bundles of grain, and heaped upon them were families of three generations. Old men in blue smocks, white-haired and bent, old women in caps, the daughters dressed in their one best frock and hat, and clasping in their hands all that was left to them, all that they could stuff into a pillow-case or flour-sack. . . . Heart-broken, weary, hungry, they passed in an unending caravan.” —Richard Harding Davis, quoted in Hooray for Peace, Hurrah for War Unable to save Belgium, the Allies retreated to the Marne River in France. There they halted the German advance in September 1914. After struggling to outflank each other’s armies, both sides dug in for a long siege. By the spring of 1915, two parallel systems of deep, rat-infested trenches crossed France. Crisis in the Balkans After World War I, Bosnia became part of a country that eventually became known as Yugoslavia. Although Yugoslavia included various religious and ethnic groups, the government was dominated by Serbs. In 1991 Yugoslavia broke apart, and Bosnia declared independence in 1992. However, Serbs wanted Bosnia to remain part of Serbiancontrolled Yugoslavia. A bloody civil war broke out. This war became notorious for the mass murder and deportation of Bosnian Muslims. This process became known as “ethnic cleansing.” In 1995 the United States helped negotiate a cease-fire. But peace in the Balkans did not last. In the late 1990s Albanians in the province of Kosovo also tried to break away from Serbia. Serbia’s violent response, which included the “ethnic cleansing” of Albanians, prompted NATO to intervene. Kosovo declared its independence in 2008, despite Serbia’s opposition. NOW & THEN Vocabulary refugee a person who flees in search of protection or shelter, as in times of war or religious persecution World War I 317 MONTENEGRO ALBANIA NETHERLANDS DENMARK TANNENBERG GALLIPOLI Eastern Front Oct. 1917 Blockade British Sarajevo Rome Paris Constantinople (Istanbul) London Petrograd (St. Petersburg) Moscow Vienna Brussels Berlin B A L K A N P E N I N S U L A GREAT BRITAIN SPAIN FRANCE ITALY GERMANY AUSTRIAHUNGARY GREECE NORWAY SWEDEN OTTOMAN EMPIRE LUXEMBOURG MONTENEGRO SWITZERLAND BELGIUM SERBIA ALBANIA ROMANIA BULGARIA NETHERLANDS DENMARK IRELAND (Br.) RUSSIA PORTUGAL ATLANTIC OCEAN North Sea Bay of Biscay Black Sea Baltic Sea Adriatic Sea Aegean Sea M e d i t e r r a n e a n S e a 40°N 50°N 0° 20°E 10°W Allied Powers, 1916 Central Powers, 1916 Neutral countries German submarine activity Battle 0 250 500 mi 0 250 500 km N S W E Explore ONLINE! A B C D Farthest German advance, Sept. 5, 1914 Front on July 1, 1916 Metz Lunéville Paris Brussels E n g l is h C h a n n e l Somme Marne Meuse Meuse Rhine Seine Moselle Oise Aisne NETHERLANDS BELGIUM FRANCE GERMANY LUXEMBOURG SWITZERLAND 0 50 100 mi 0 50 100 km MARNE, 1st battle, Sept. 1914 Allies stop German advance on Paris Germans use chemical weapons for the first time YPRES, 2nd battle, May 1915 French hold the line in longest battle of the war VERDUN, Feb.–July 1916 A B C D Disastrous British offensive German troop movement Allied troop movement SOMME, 1st battle, July–Nov. 1916 N S W E HMH—MiddleSchoolUSHistory—2016MapQuest.Com, Inc. McDougal-Littel, American History Program arpe-0311s1-15-e Europe 1914,1919 - Locator Trim size 8 picas wide X 4 picas deep 6th Proof date: 5/21/01 Interpret Maps 1. Location About how many miles separated the city of Paris from German forces at the point of their closest approach? 2. Place Consider the geographical location of the Allies in relation to the Central powers. What advantage might the Allies have had? Europe at the Start of World War I May 1915 Lusitania is sunk. Sarajevo, June 1914 Archduke Franz Ferdinand is assassinated. Tannenberg, August 1914 Germans stop Russian advance. Gallipoli, April 1915–January 1916 Allied forces are defeated in bid to establish a supply route to Russia. THE WESTERN FRONT, 1914–1916 318 Module 7 1 1 2 2 3 3 4 4 The trenches stretched from the Belgian coast to the Swiss Alps. German soldiers occupied one set of trenches, Allied soldiers the other. The scale of slaughter was horrific. During the First Battle of the Somme—which began on July 1, 1916, and lasted until mid-November—the British suffered 60,000 casualties the first day alone. Final casualties totaled about 1.2 million, yet only about seven miles of ground changed hands. This virtual stalemate lasted for more than three years. Elsewhere, the fighting was just as devastating and inconclusive. IN THE TRENCHES The stalemate was mainly an effect of trench warfare, in which armies fought for mere yards of ground. On the battlefields of Europe, there were three main kinds of trenches—front line, support, and reserve. Soldiers spent a period of time in each kind of trench. Dugouts, or underground rooms, were used as officers’ quarters and command posts. Between the trench complexes lay “no man’s land.” This was a barren expanse of mud pockmarked with shell craters and filled with barbed wire. Periodically, the soldiers charged enemy lines, only to be mowed down by machine-gun fire. Life in the trenches was miserable. The soldiers were surrounded by filth, lice, rats, and polluted water that caused dysentery. Many soldiers suffered trench foot. This condition was caused by standing in cold, wet trenches for Trench Warfare Artillery fire “softened up” resistance before an infantry attack. Barbed wire entanglements “No Man’s Land” (from 25 yards to a mile wide) Dugout Communication trenches connected the three kinds of trenches. Saps were shallow trenches in “no man’s land,” allowing access to machine-gun nests, grenade-throwing positions, and observation posts. Front line trench Support trench Reserve trench Enemy trench World War I 319 long periods of time without changing into dry socks or boots. First, the toes would turn red or blue. Then, they would become numb, and finally, they would start to rot. The only solution was to amputate the toes, and in some cases, the entire foot. A painful infection of the gums and throat, called trench mouth, was also common among the soldiers. The soldiers also suffered from lack of sleep. Constant bombardments and other experiences often led to battle fatigue and “shell shock.” This term was coined during World War I to describe a complete emotional collapse from which many never recovered. Americans Question Neutrality Just after the fighting in Europe began, President Woodrow Wilson declared that the United States would remain neutral. His statement reflected a longstanding American commitment to isolationism. Most Americans agreed that there was no reason to join a struggle 3,000 miles away. The war did not threaten American lives or property. This did not mean, however, that certain groups and individuals in the United States were indifferent to who would win the war. Public opinion was strong—but divided. DIVIDED LOYALTIES Socialists criticized the war as a capitalist and imperialist struggle between Germany and England to control markets and colonies in China, Africa, and the Middle East. Pacifists, such as lawyer and politician William Jennings Bryan, believed that war was evil and that the United States should set an example of peace to the world. Many Americans simply did not want their sons to experience the horrors of warfare, as a hit song of 1915 conveyed. “I didn’t raise my boy to be a soldier, I brought him up to be my pride and joy. Who dares to place a musket on his shoulder, To shoot some other mother’s darling boy?” Millions of naturalized U.S. citizens followed the war closely because they still had ties to the nations from which they had emigrated. For example, many Americans of German descent sympathized with Germany. Americans of Irish descent remembered the centuries of British oppression in Ireland. They saw the war as a chance for Ireland to gain its independence. Pressure from some of these ethnic groups in the United States contributed to American neutrality. Some immigrants created organizations to help the causes of their homelands. Some even advised the government on policies that affected the people of their homelands. On the other hand, many Americans felt close to Britain because of a  common ancestry and language as well as similar democratic institutions and legal systems. Germany’s aggressive sweep through Belgium increased American sympathy for the Allies. The Germans attacked civilians, destroying villages, cathedrals, libraries, and even hospitals. Some atrocity stories—spread Vocabulary emigrate to leave one’s country or region to settle in another; to move Reading Check Analyze Effects Why were so many European nations pulled into the conflict? The British spread the news of Germany’s atrocious attacks on civilians through propaganda, but most Americans felt the war in Europe was not their fight. 320 Module 7 France Germany Great Britain All Other European Countries Dollars (in millions) 2,000 1,600 1,200 800 400 0 1912 1913 1914 1915 1916 1917 U.S. Exports to Europe, 1912–1917 by British propaganda—later proved to be false. However, enough of them proved true that one American magazine referred to Germany as “the bully of Europe.” Maintaining neutrality proved difficult for American businesses. America’s economic ties with the Allies were far stronger than its ties with the Central powers. Before the war, American trade with Britain and France was more than double its trade with Germany. With the start of the war, America’s transatlantic trade became even more lopsided. The Allies flooded American manufacturers with orders for all sorts of war supplies. These included dynamite, cannon powder, submarines, copper wire and tubing, and armored cars. The United States shipped millions of dollars of war supplies to the Allies, but requests kept coming. By 1915 American factories were producing so many supplies for the Allies that the United States was experiencing a labor shortage. Some businesses, seeking to remain neutral, tried to continue dealing with Germany, but this trade became increasingly risky. Shipments were often stopped by the British navy. In addition, President Wilson and others spoke out against German atrocities and warned of the threat that the German empire posed to democracy. From 1914 on, trade with the Allies quadrupled, while trade with Germany fell to near zero. Also, by 1917 American banks had loaned $2.3 billion to the Allies, but only $27 million to the Central powers. Many U.S. leaders, including Treasury secretary William McAdoo, felt that American prosperity depended upon an Allied victory. The War Hits Home Although the majority of Americans favored victory for the Allies rather than the Central powers, they did not want to join the Allies’ fight. By 1917, however, America had mobilized for war against the Central powers in order to ensure Allied repayment of debts to the United States and to prevent the Germans from threatening U.S. shipping. THE BRITISH BLOCKADE As fighting on land continued, Britain began to make more use of its naval strength. It blockaded the German coast to prevent weapons and other military supplies from getting through. However, the British expanded the definition of contraband to include food. They also extended the blockade to neutral ports and mined the entire North Sea. The results were twofold. First, American ships carrying goods for Germany refused to challenge the blockade and seldom reached their destination. Second, Germany found it increasingly difficult to import foodstuff Interpret Graphs 1.By how much did total U.S. exports to Europe rise or fall between 1914 and 1917? 2.What trends does the graph show before the start of the war and during the war? Reading Check Analyze Motives Why did the United States begin to favor Britain and France? World War I 321 and fertilizers for crops. By 1917 famine stalked the country. An estimated 750,000 Germans starved to death as a result of the British blockade. Americans had been angry at Britain’s blockade. It threatened freedom of the seas and prevented American goods from reaching German ports. However, Germany’s response to the blockade soon outraged Americans. GERMAN U-BOAT RESPONSE Germany responded to the British blockade with a counterblockade by U-boats (from Unterseeboot, the German word for submarine). Any British or Allied ship found in the waters around Britain would be sunk—and it would not always be possible to warn crews and passengers of an attack. One of the worst disasters occurred on May 7, 1915, when a U- boat sank the British liner Lusitania (loo´sĭ-taʹnē-ә) off the Irish coast. Of the 1,198 persons lost, 128 were Americans. The Germans defended their action on the grounds that the liner carried ammunition. Despite Germany’s explanation, Americans became outraged with Germany because of the loss of life. American public opinion turned against Germany and the Central powers. Despite this provocation, President Wilson ruled out a military response in favor of a sharp protest to Germany. Three months later, in August 1915, a U-boat sank another British liner, the Arabic, drowning two Americans. Again the United States protested, and this time Germany agreed not to sink any more passenger ships. But in March 1916 Germany broke its promise and torpedoed an unarmed French passenger steamer, the Sussex. The Sussex sank, and about 80 passengers, including Americans, were killed or injured. After this attack, Wilson threatened to end diplomatic relations with Germany unless it stopped killing innocent civilians. German officials feared that the United States might enter the war, so Germany issued the Sussex pledge, which included a promise not to sink merchant vessels “without warning and without saving human lives.” But there was a condition: if the United States could not persuade Britain to lift its blockade against food and fertilizers, Germany would consider renewing unrestricted submarine warfare. This image of a U-boat crew machine-gunning helpless survivors of the Lusitania was clearly meant as propaganda. In fact, U-boats seldom lingered after an attack. 322 Module 7 THE 1916 ELECTION In November 1916 came the U.S. presidential election. The Democrats renominated Wilson, and the Republicans nominated Supreme Court Justice Charles Evans Hughes. Wilson campaigned on the slogan “He Kept Us Out of War.” Hughes pledged to uphold America’s right to freedom of the seas but also promised not to be too severe on Germany. The election returns shifted from hour to hour. In fact, Hughes went to bed believing he had been elected. When a reporter tried to reach him with the news of Wilson’s victory, an aide to Hughes said, “The president can’t be disturbed.” “Well,” replied the reporter, “when he wakes up, tell him he’s no longer president.” The United States Declares War Despite Wilson’s efforts on behalf of peace, hope seemed lost. The Allies were angered by Wilson’s request for “peace without victory.” They blamed the Central powers for starting the war and wanted them to pay for wartime damage and destruction. Germany, too, ignored Wilson’s call for peace. GERMAN PROVOCATION Germany’s leaders hoped to defeat Britain by resuming unrestricted submarine warfare. On January 31 the kaiser announced that U-boats would sink all ships in British waters—hostile or neutral—on sight. Wilson was stunned. The German decision meant that the United States would have to go to war. However, the president held back, saying that he would wait for “actual overt acts” before declaring war. Document-Based Investigation Historical Source “Peace Without Victory” After the 1916 election, President Wilson tried to mediate between the warring alliances in Europe. The attempt failed. In a later speech, the president asked the Allied and Central powers to accept a “peace without victory,” in which neither side would impose harsh terms on the other. “The treaties and agreements which bring [the war] to an end must embody terms which will create a peace that is worth guaranteeing and preserving, a peace that will win the approval of mankind, not merely a peace that will serve the several interests and immediate aims of the nations engaged. . . . it must be a peace without victory . . . Victory would mean peace forced upon the loser, a victor’s terms imposed upon the vanquished. It would be accepted in humiliation, under duress, at an intolerable sacrifice, and would leave a sting, a resentment, a bitter memory upon which terms of peace would rest, not permanently, but only as upon quicksand. Only a peace between equals can last.” —President Woodrow Wilson, from an address to the Senate, January 22, 1917 Analyze Historical Sources How does this speech reflect Wilson’s ideas about equality in a postwar world? Reading Check Analyze Effects How did the German U-boat campaign affect U.S. public opinion? World War I 323 The overt acts came. First was the Zimmermann note, a secret telegram from the German foreign minister to the German ambassador in Mexico that was intercepted and decoded by British agents. The telegram proposed an alliance between Mexico and Germany and promised that if war with the United States broke out, Germany would support Mexico in recovering “lost territory in Texas, New Mexico, and Arizona.” The Germans hoped that an American war with Mexico would keep the United States out of the war in Europe. Excerpts of the telegram were printed in newspapers. The American public was outraged. On top of this, the Germans sank four unarmed American merchant ships, with a loss of 36 lives, further angering Americans. A REVOLUTION IN RUSSIA Meanwhile, events in Russia also troubled the United States. By the end of 1915 Russia had suffered about 2.5 million casualties in the fight against the Central powers and was experiencing massive food shortages. Blaming the Russian czar for the nation’s losses, revolutionaries ousted him in March 1917 and established a provisional government. In November, a group known as the Bolsheviks overthrew the provisional government and set up a Communist state. The new government withdrew the Russian army from the eastern front and signed a peace agreement with the Central powers. With Russia out of the conflict, Germany was free to focus on fighting in the west. It looked as if Germany had a chance of winning the war. These events removed the last significant obstacle to direct U.S. involvement in the war. Now supporters of American entry into the war could claim that this was a war of democracies against brutal monarchies. AMERICA ACTS A light drizzle fell on Washington on April 2, 1917, as senators, representatives, ambassadors, members of the Supreme Court, and other guests crowded into the Capitol to hear President Wilson deliver his war resolution. Alliances During World War I Allies Central Powers Australia Italy Belgium Japan British Colonies Montenegro Canada & Newfoundland New Zealand France Portugal French North Africa & Romania French Colonies Russia Great Britain Serbia Greece South Africa India United States Austria-Hungary Bulgaria Germany Ottoman Empire Although not all of the countries listed above sent troops into the war, they all joined the war on the Allied side at various times. Background The Bolsheviks were led by Vladimir Ilich Lenin and Leon Trotsky. 324 Module 7 Lesson 1 Assessment 1. Organize Information Use a web diagram to list the causes for the outbreak of World War I. Which was the most significant cause? Explain your answer. 2. Key Terms and People For each key term or person in the lesson, write a sentence explaining its significance. 3. Analyze Issues Why do you think Germany escalated its U-boat attacks in 1917? Think About: • Germany’s military buildup • the effects of the British blockade • Germany’s justification for unrestricted submarine warfare"
       `;
  conversationHistory.push({ role: "system", content: staticMessage });

  const talkResponse = await fetchWithRetries(`/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "messages": conversationHistory
    }),
  });
  // //debugger
  const responseData = await talkResponse.json();
  const modelResponse = responseData.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: modelResponse });
  console.log("Response from trainingChatGpt():", modelResponse);

}

document.addEventListener('DOMContentLoaded', async () => {
  await trainingChatGpt();
});



async function connect() {
  if (peerConnection && peerConnection.connectionState === 'connected') {
    return;
  }

  stopAllStreams();
  closePC();

  const sessionResponse = await fetchWithRetries(`${DID_API.url}/talks/streams`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url: 'https://i.postimg.cc/XJj2KDmf/stroga-teta.jpg',
    }),
  });

  const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json();
  streamId = newStreamId;
  sessionId = newSessionId;

  try {
    sessionClientAnswer = await createPeerConnection(offer, iceServers);
  } catch (e) {
    console.log('error during streaming setup', e);
    stopAllStreams();
    closePC();
    return;
  }

  const sdpResponse = await fetch(`${DID_API.url}/talks/streams/${streamId}/sdp`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${DID_API.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      answer: sessionClientAnswer,
      session_id: sessionId,
    }),
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await connect();
});

document.getElementById("send-button").addEventListener("click", onSendMessage);
talkVideo.addEventListener("click", toggleAudio);

function toggleAudio() {
  $("#talk-video").prop('muted', false);
}

async function onSendMessage() {

  // Get the input value
  var nameInput = document.getElementById("message").value;

  conversationHistory.push({ role: "user", content: nameInput });

  var messageInput = document.getElementById("message")
  // messageInput.style.display = "none";

  const spinner = document.querySelector('.spinner-border');
  spinner.style.display = 'block';

  const talkResponse = await fetchWithRetries(`/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "messages": conversationHistory
    }),
  });
  ////debugger
  const responseData = await talkResponse.json();
  const modelResponse = responseData.choices[0].message.content;
  console.log("Modelresponse", modelResponse);



  // console.log(talkResponse.body);


  //start
  var input_text = modelResponse; //document.getElementById("result").innerText

  if(DID_API.env === 'dev') {
    input_text = input_text.slice(0, 5);
  }

  //debugger
  if (peerConnection?.signalingState === 'stable' || peerConnection?.iceConnectionState === 'connected') {
    const talkResponse = await fetchWithRetries(`${DID_API.url}/talks/streams/${streamId}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // script: {
        //   type: 'audio',
        //   audio_url: 'https://d-id-public-bucket.s3.us-west-2.amazonaws.com/webrtc.mp3',
        // },
        script: {
          type: 'text',
          reduce_noise: 'false',
          provider: {
            type: 'microsoft',
            voice_id: 'en-GB-AbbiNeural'
          },
          input: input_text
        },
        driver_url: 'bank://lively/',
        config: {
          fluent: 'false',
          align_driver: 'false',
          pad_audio: '0.0'
        },
        session_id: sessionId,
      }),
    });
  }

  spinner.style.display = 'none';

  // Show the message input again
  // messageInput.style.display = "block";
  messageInput.value = ""; // Clear the input field


}

$(document).ready(function () {
  $('#message').keydown(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      $('#send-button').click();
    }
  });
});
// document.getElementById("myForm").addEventListener("submit", async function(event) {

// });

// const destroyButton = document.getElementById('destroy-button');
// destroyButton.onclick = async () => {
//   await fetch(`${DID_API.url}/talks/streams/${streamId}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Basic ${DID_API.key}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ session_id: sessionId }),
//   });

//   stopAllStreams();
//   closePC();
// };

function onIceGatheringStateChange() {
  const spinner = document.querySelector('.spinner-border');
  spinner.style.display = 'block';
  spinner.style.display = 'none';

  // iceGatheringStatusLabel.innerText = peerConnection.iceGatheringState;
  // iceGatheringStatusLabel.className = 'iceGatheringState-' + peerConnection.iceGatheringState;
}
function onIceCandidate(event) {
  console.log('onIceCandidate', event);
  if (event.candidate) {
    const { candidate, sdpMid, sdpMLineIndex } = event.candidate;

    fetch(`${DID_API.url}/talks/streams/${streamId}/ice`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${DID_API.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidate,
        sdpMid,
        sdpMLineIndex,
        session_id: sessionId,
      }),
    });
  }
}
function onIceConnectionStateChange() {
  // iceStatusLabel.innerText = peerConnection.iceConnectionState;
  // iceStatusLabel.className = 'iceConnectionState-' + peerConnection.iceConnectionState;
  if (peerConnection.iceConnectionState === 'failed' || peerConnection.iceConnectionState === 'closed') {
    stopAllStreams();
    closePC();
  }
}
function onConnectionStateChange() {
  // not supported in firefox
  // peerStatusLabel.innerText = peerConnection.connectionState;
  // peerStatusLabel.className = 'peerConnectionState-' + peerConnection.connectionState;
}
function onSignalingStateChange() {
  // signalingStatusLabel.innerText = peerConnection.signalingState;
  // signalingStatusLabel.className = 'signalingState-' + peerConnection.signalingState;
}



function onVideoStatusChange(videoIsPlaying, stream) {
  //debugger
  let status;
  if (videoIsPlaying) {

    const talkVideo = document.getElementById("talk-video");
    talkVideo.addEventListener("play", function () {



      // Set the background color to black when video starts playing
      // talkVideo.style.backgroundColor = "black";
      // talkVideo.style.objectFit = "contain";
    });
    status = 'streaming';
    const remoteStream = stream;
    setVideoElement(remoteStream);
  } else {
    status = 'empty';
    // playIdleVideo();
  }
  // streamingStatusLabel.innerText = status;
  // streamingStatusLabel.className = 'streamingState-' + status;
}

function onTrack(event) {
  /**
   * The following code is designed to provide information about wether currently there is data
   * that's being streamed - It does so by periodically looking for changes in total stream data size
   *
   * This information in our case is used in order to show idle video while no talk is streaming.
   * To create this idle video use the POST https://api.d-id.com/talks endpoint with a silent audio file or a text script with only ssml breaks 
   * https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html#break-tag
   * for seamless results use `config.fluent: true` and provide the same configuration as the streaming video
   */

  if (!event.track) return;

  statsIntervalId = setInterval(async () => {
    const stats = await peerConnection.getStats(event.track);
    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        const videoStatusChanged = videoIsPlaying !== report.bytesReceived > lastBytesReceived;

        if (videoStatusChanged) {
          videoIsPlaying = report.bytesReceived > lastBytesReceived;
          onVideoStatusChange(videoIsPlaying, event.streams[0]);
        }
        lastBytesReceived = report.bytesReceived;
      }
    });
  }, 500);
}

async function createPeerConnection(offer, iceServers) {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection({ iceServers });
    peerConnection.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
    peerConnection.addEventListener('icecandidate', onIceCandidate, true);
    peerConnection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
    peerConnection.addEventListener('connectionstatechange', onConnectionStateChange, true);
    peerConnection.addEventListener('signalingstatechange', onSignalingStateChange, true);
    peerConnection.addEventListener('track', onTrack, true);
  }

  await peerConnection.setRemoteDescription(offer);
  console.log('set remote sdp OK');

  const sessionClientAnswer = await peerConnection.createAnswer();
  console.log('create local sdp OK');

  await peerConnection.setLocalDescription(sessionClientAnswer);
  console.log('set local sdp OK');

  return sessionClientAnswer;
}

function setVideoElement(stream) {
  if (!stream) return;
  talkVideo.srcObject = stream;
  talkVideo.loop = false;

  // safari hotfix
  if (talkVideo.paused) {
    talkVideo
      .play()
      .then((_) => { })
      .catch((e) => { });
  }
}

function playIdleVideo() {
  talkVideo.srcObject = undefined;
  talkVideo.src = 'public/video/video.mp4';
  talkVideo.loop = true;
}

function stopAllStreams() {
  if (talkVideo.srcObject) {
    console.log('stopping video streams');
    talkVideo.srcObject.getTracks().forEach((track) => track.stop());
    talkVideo.srcObject = null;
  }
}

function closePC(pc = peerConnection) {
  if (!pc) return;
  console.log('stopping peer connection');
  pc.close();
  pc.removeEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
  pc.removeEventListener('icecandidate', onIceCandidate, true);
  pc.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
  pc.removeEventListener('connectionstatechange', onConnectionStateChange, true);
  pc.removeEventListener('signalingstatechange', onSignalingStateChange, true);
  pc.removeEventListener('track', onTrack, true);
  clearInterval(statsIntervalId);
  // iceGatheringStatusLabel.innerText = '';
  // signalingStatusLabel.innerText = '';
  // iceStatusLabel.innerText = '';
  // peerStatusLabel.innerText = '';
  console.log('stopped peer connection');
  if (pc === peerConnection) {
    peerConnection = null;
  }
}

const maxRetryCount = 3;
const maxDelaySec = 4;

async function fetchWithRetries(url, options, retries = 1) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= maxRetryCount) {
      const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), maxDelaySec) * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Request failed, retrying ${retries}/${maxRetryCount}. Error ${err}`);
      return fetchWithRetries(url, options, retries + 1);
    } else {
      throw new Error(`Max retries exceeded. error: ${err}`);
    }
  }
}
