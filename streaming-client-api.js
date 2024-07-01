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
img.src = '/public/img/backgr.jpg';
img.onload = function() {
    ctx.drawImage(img, 0, 0);
};

// var imgface = new Image();
// imgface.src = '/public/img/face.jpg';
// imgface.onload = function() {
//     ctx.drawImage(imgface, 94, 120);
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
      ctx.drawImage($this, 94, 120, 319, 322);
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
  const staticMessage = `"You are an AI Assistant who acts as a Tutor for students learning about the History of Finance, Chapter 1, Summerians..\nAs a Tutor you are impersionating Karl Marx (5 May 1818 – 14 March 1883) was a German-born philosopher, political theorist, economist, historian, sociologist, journalist, and revolutionary socialist.\nYour job is by impersanating Rankin and her style of writing and talking to help the students understand the chapter.\nAs a tutor your job is to use all interactive types of learning from role play, to real-life scenarios to answering direct questions, to storytelling about the chapter topic as if you were there.\nWhen tutoring use only the material of the topic and part of the topic that are at the end of the prompt, and only that data, don't invent anything or add anything, when talking about the chapter use the data bellow that is from one chapter of the book the students learn from. \nIf student asks about something that is not in this chapter, instruct the user to open the relevant chapter in the app, by pressing back and clicking on the chapter he wants to know about.\nAlways be helpful, and adapt your tutoring according to the students reaction.\nWhen you receive by the student start, first you introduce yourself shortly, emphasizing you are an AI impersonating a historical figure, and ask the user if they want to start with interactive story telling, or they have some specific questions on this Chapter.\nIf the user wants interactive story telling start from the beginning of the chapter added in this prompt, turning it in first person from the view point of Rankin.\nAlways tell a short part , ask the user a question about that part that you think will prompt the user to go deeper.\nWhen the user answers, comment on the answer, and continue with the next part of the chapter.\nNever talk very long, maximum of 100 words before asking the user for interactive feedback.\nuse best teaching practises to help the user understand, be engaged and find this interactive.\nIf the student asks to help him learn about the chapter by explaining the chapter by making the student and his friends part of the story, conquer to the quest, ask about his and his friends names, and as you start teaching about the chapter from start, do it through a story where the student and his friends have some role of bystandards and observers in that time, living through the material with you. \nGive adaptable life examples and scenarios to help the students understand better.\nAlways be concise, truthful, use only true data, stay on point.\nAfter every correct answer of the user on the interactive questions continue with the next part of the chapter, until you finished the whole chapter\nif the user gives incorrect answer when interactvly asked after each part, correct him , explain him, and then continue with the next part.\nYou have to always go chronoligcly through the whole chapter, and teach the whole chapter to the student, Once the student finishes the chapter, ask him if he has questions, and if he wants to do a quiz.\nIn quiz, start testing the student knowledge part by part, and for every incorrect answer correct the student, help him understand, at the end of the squiz give the user his score of how many right questions, and how many wrong he answered.\nBellow is the chapter 1 from Economics 101\nWhat Is Economics?\nWhy It Matters\nCongratulations on being\nselected to head up the prom\ncommittee! Now you must\ndecide on location, music, and\nrefreshments. What factors do\nyou need to consider when\nmaking your choices? In groups\nof four, determine your budget\nand identify possible locations,\nmusic providers, and food. Read\nChapter 1 to learn how your\nprom selections, like all\neconomic decisions, require you\nto make choices about how to\nbest use limited resources.\nThe BIG Idea\nScarcity is the basic economic\nproblem that requires people to\nmake careful choices about how\nto use limited resources.\nChapter Overview Visit the\nEconomics: Principles and Practices Web site at glencoe.com and click\non Chapter 1—Chapter Overviews to preview chapter information.\nBecause of limited resources,\nconsumers must make choices.\n4 UNIT 1\nMasterfile\nGUIDE TO READING\nCHAPTER 1 What Is Economics? 5\nPEOPLE IN THE NEWS —moneycentral.msn.com\nTeens in the Red\nLike a lot of hard-working women, Andrea Alba has moments\nof financial despair. Between juggling three jobs, paying her bills\nand trying to get out of debt, she feels overwhelmed. “I just\nwant to pay everything off,” she says. “I wish I didn’t have to\nstruggle so much.” But Alba is no debt-weary baby boomer.\nShe’s only 19 and a couple of years out of high school.\nHer financial burdens may be heavier than other teens: She\npays her own college tuition and also helps pay the rent and\nutilities at home. But the sinker was signing that first credit card\napplication before she had even graduated from high school. “It\nwas fine at first,” she says. “I used it mainly for gas. Then it just\ngot deeper and deeper.” Within a year and a half of her 18th\nbirthday, Alba was $2,500 in the hole. ■\nSECTION\n1 Scarcity and the Science of\nEconomics\nSection Preview\nIn this section, you will learn why scarcity is the basic\neconomic problem that faces every society and why\nscarcity requires us to make choices.\nContent Vocabulary\n• scarcity (p. 6) • capital (p. 8)\n• economics (p. 6) • capital good (p. 8)\n• need (p. 6) • labor (p. 8)\n• want (p. 6) • entrepreneur (p. 9)\n• factors of • gross domestic product\nproduction (p. 8) (GDP) (p. 9)\n• land (p. 8)\nAcademic Vocabulary\n• resource (p. 6) • comprehensive (p. 10)\nReading Strategy\nListing As you read the section, complete a graphic\norganizer like the one below by listing and describing\nthe three economic choices every society must make.\nYou may wonder if the study of econom-\nics is worth your time and effort. As you\nlearned in the news story, though, many\nyoung people find out about economic\nissues the hard way. They discover, how-\never, that a basic understanding of econom-\nics can help them make sense of the world\nthey live in.\nThe study of economics helps us in many\nways, especially in our roles as individuals,\nas members of our communities, and as\nglobal citizens. The good news is that eco-\nnomics is not just useful. It can be interest-\ning as well, so don’t be surprised to find\nthat the time you spend on this topic will\nbe well spent.\nEconomic Choices\nPersonal Finance\nHandbook\nSee pages R10–R13\nfor more information\non credit cards.\nCorbis\nscarcity\nfundamental economic\nproblem of meeting\npeople’s virtually\nunlimited wants with\nscarce resources\neconomics social\nscience dealing with\nhow people satisfy\nseemingly unlimited\nand competing wants\nwith the careful use of\nscarce resources\nneed basic\nrequirement for\nsurvival, including\nfood, clothing, and\nshelter\nwant something we\nwould like to have but\nis not necessary for\nsurvival\nThe Fundamental\nEconomic Problem\nMAIN Idea Societies do not have enough\nproductive resources to satisfy everyone’s wants\nand needs.\nEconomics & You Can you remember a time\nwhen you saved money to buy something expensive?\nWas the item a necessity or something that you\nsimply wanted to own? Read on to find out how this\nrelates to the core concepts of economics.\nHave you ever noticed that very few\npeople are satisfied with the things they\nhave? For example, someone without a\nhome may want a small one; someone else\nwith a small home may want a larger one;\nsomeone with a large home may want a\nmansion. Whether they are rich or poor,\nmost people seem to want more than they\nalready have. In fact, if each of us were to\nmake a list of all the things we want, it\nwould most likely include more things\nthan we could ever hope to obtain.\nScarcity\nThe fundamental economic problem fac-\ning all societies is that of scarcity. Scarcity\nis the condition that results from society\nnot having enough resources to produce\nall the things people would like to have.\nAs Figure 1.1 shows, scarcity affects almost\nevery decision we make. This is where eco-\nnomics comes in. Economics is the study of\nhow people try to satisfy seemingly unlim-\nited and competing wants through the care-\nful use of relatively scarce resources.\nNeeds and Wants\nEconomists often talk about people’s\nneeds and wants. A need is a basic require-\nment for survival, such as food, clothing,\nand shelter. A want is simply something we\nwould like to have but is not necessary for\nsurvival. Food, for example, is needed for\nsurvival. Because many foods will satisfy the\nneed for nourishment, the range of things\nrepresented by the term want is much broader\nthan that represented by the term need.\nTINSTAAFL\nBecause resources are limited, every-\nthing we do has a cost—even when it seems\nas if we are getting something “for free.”\nFor example, do you really get a free meal\nwhen you use a “buy one, get one free”\ncoupon? The business that gives it away\nstill has to pay for the resources that went\ninto the meal, so it usually tries to recover\nthese costs by charging more for its other\nproducts. In the end, you may actually be\nthe one who pays for the “free” lunch!\nRealistically, most things in life are not\nfree, because someone has to pay for pro-\nducing them in the first place. Economists\nuse the term TINSTAAFL to describe this\nconcept. In short, it means There Is No Such\nThing As A Free Lunch.\nReading Check Contrasting What is the difference\nbetween a need and a want?\nScarcity is the fundamental economic problem that forces consumers\nand producers to use resources wisely.\nEconomic Analysis Why is scarcity a universal problem?\nFigure 1.1 Scarcity\nSCARCITY SCARCITY\nChoices\nFOR WHOM\nto produce\nWHAT\nto produce\nUnlimited\nwants\nUnlimited\nwants\nLimited\nresources\nLimited\nresources\nHOW\nto produce\nCHAPTER 1 What Is Economics? 7\nThree Basic Questions\nMAIN Idea Scarcity forces every society to\nanswer the basic questions of WHAT, HOW, and\nFOR WHOM to produce.\nEconomics & You When you write a report,\nyou usually answer the who, what, when, where, and\nwhy questions. Read on to learn about the three basic\nquestions in economics.\nBecause we live in a world of relatively\nscarce resources, we have to make careful\neconomic choices about the way we use\nthese resources. Figure 1.1 presents three\nbasic questions we need to answer as we\nmake these choices.\nWHAT to Produce\nThe first question is WHAT to produce.\nFor example, should a society direct most of\nits resources to the production of military\nequipment or to other items such as food,\nclothing, or housing? Suppose the decision\nis to produce housing. Should the limited\nresources be used to build low-income,\nmiddle-income, or upper-income housing?\nA society cannot have everything its people\nwant, so it must decide WHAT to produce.\nHOW to Produce\nA second question is HOW to produce.\nShould factory owners use automated pro-\nduction methods that require more machines\nand fewer workers, or should they use fewer\nmachines and more workers? If a commu-\nnity has many unemployed people, using\nmore workers might be better. On the other\nhand, in countries where machinery is\nwidely available, automation can often\nlower production costs. Lower costs make\nmanufactured items less expensive and,\ntherefore, available to more people.\nFOR WHOM to Produce\nThe third question is FOR WHOM to\nproduce. After a society decides WHAT\nand HOW to produce, it must decide who\nwill receive the things produced. If a\nsociety decides to produce housing, for\nexample, should it be the kind of housing\nthat is wanted by low-income workers,\nmiddle-income professional people, or\nthe very rich? If there are not enough\nhouses for everyone, a society has to\nmake a choice about who will receive the\nexisting supply.\nThese questions concerning WHAT,\nHOW, and FOR WHOM to produce are\nnever easy for any society to answer.\nNevertheless, they must be answered as\nlong as there are not enough resources to\nsatisfy people’s seemingly unlimited wants\nand needs.\nReading Check Analyzing Why are societies\nfaced with the three basic questions of WHAT, HOW,\nand FOR WHOM?\nWHAT to Produce Societies need to decide whether to include parks in\nhousing areas or to produce more housing. How do the three questions help\nsocieties make choices about scarce resources?\nCorbis\n8 UNIT 1 Fundamental Economic Concepts\nThe Factors of\nProduction\nMAIN Idea Four factors of production—land,\ncapital, labor, and entrepreneurs—must be present\nto produce goods and services.\nEconomics & You When you were younger, did\nyou ever sell something or have a paper route to\nmake money? Read on to find out how this relates to\nthe factors of production.\nPeople cannot satisfy all their wants and\nneeds because productive resources are\nscarce. The factors of production, or\nresources required to produce the things\nwe would like to have, are land, capital,\nlabor, and entrepreneurs. As shown in\nFigure 1.2, all four are required to produce\ngoods and services.\nLand\nIn economics, land refers to the “gifts of\nnature,” or natural resources not created by\npeople. “Land” includes deserts, fertile\nfields, forests, mineral deposits, livestock,\nsunshine, and the climate necessary to grow\ncrops. Because a finite amount of natural\nresources are available at any given time,\neconomists tend to think of land as being\nfixed, or in limited supply.\nCapital\nAnother factor of production is capital,\nsometimes called capital goods—the tools,\nequipment, machinery, and factories used in\nthe production of goods and services. Capital\nis unique because it is the result of produc-\ntion. A bulldozer, for example, is a capital\ngood used in construction. When it was built\nin a factory, it was the result of production\ninvolving other capital goods. The computers\nin your school that are used to produce the\nservice of education also are capital goods.\nLabor\nA third factor of production is labor—\npeople with all their efforts, abilities, and\nskills. This category includes all people except\na unique group of individuals called entre-\npreneurs, whom we single out because of\ntheir special role in the economy. Historically,\nfactors such as birthrates, immigration, fam-\nine, war, and disease have had a dramatic\nimpact on the quantity and quality of labor.\nfactors of\nproduction\nproductive resources\nthat make up the four\ncategories of land,\ncapital, labor, and\nentrepreneurs\nland natural\nresources or other\n“gifts of nature” not\ncreated by human\neffort\ncapital or capital\ngoods tools,\nequipment, and\nfactories used in the\nproduction of goods\nand services\nlabor people with all\ntheir efforts, abilities\nand skills\nFigure 1.2 The Factors of Production\nThe four factors of production are necessary for production to take place.\nEconomic Analysis What four factors of production are necessary to bring\nclothing to consumers?\nLand Capital Labor Entrepreneurs\nEntrepreneurs are\nindividuals who start a\nnew business or bring\na product to market.\nLand includes the\n“gifts of nature,” or natural\nresources not created by\nhuman effort.\nCapital includes the\ntools, equipment, and\nfactories used in\nproduction.\nLabor includes people\nwith all their efforts\nand abilities.\n(l) Corbis, (cl) Neil Beer/Getty Images, (cr) Sie Productions/Zefa/Corbis, (r) Howard Grey/Getty Images\nCHAPTER 1 What Is Economics? 9\nEntrepreneurs\nSome people are singled out because\nthey are the innovators responsible for\nmuch of the change in our economy. Such\nan individual is an entrepreneur, a risk-\ntaker in search of profits who does some-\nthing new with existing resources.\nEntrepreneurs are often thought of as being\nthe driving force in an economy because\nthey are the people who start new busi-\nnesses or bring new products to market.\nProduction\nEverything we make requires the four\nfactors of production. The desks and lab\nequipment used in schools are capital\ngoods. Teachers and other employees pro-\nvide the labor. Land includes the property\nwhere the school is located as well as the\niron ore and timber used to make the build-\ning. Finally, entrepreneurs are needed to\norganize the other three factors and make\nsure that everything gets done.\nReading Check Interpreting What would happen\nif one of the factors of production was missing?\nThe Scope of Economics\nMAIN Idea Economics analyzes how societies\nsatisfy wants through careful use of relatively\nscarce resources.\nEconomics & You So far, you have learned\nabout the basics of economics. Read on to learn how\neconomists help us make sense of this information.\nEconomics is the study of human efforts\nto satisfy seemingly unlimited and compet-\ning wants through the careful use of rela-\ntively scarce resources. Economics is also a\nsocial science because it deals with the\nbehavior of people as they deal with this\nbasic issue. The four key elements to this\nstudy are description, analysis, explana-\ntion, and prediction.\nDescription\nOne part of economics describes eco-\nnomic activity. For example, we often hear\nabout gross domestic product (GDP)—the\ndollar value of all final goods, services, and\nstructures produced within a country’s\nborders in a 12-month period. GDP is the\nentrepreneur\nrisk-taking individual in\nsearch of profits\ngross domestic\nproduct (GDP)\ndollar value of all final\ngoods, services, and\nstructures produced\nwithin a country’s\nborders during a\none-year period\nGlobal Entrepreneurs Drive\nthe Economy\nEvery time you get paid for baby-sitting, mowing the\nlawn, or being the deejay at an event, you have joined\nthe “force”—the global entrepreneurial force, that is. A\nvast majority of the more than 20 million businesses in\nthe United States are owned by entrepreneurs. Most\neither work alone or have a few employees.\nUntil recently, the United States led in the percentage\nof adult entrepreneurs, with an estimated 11.3 percent\nof Americans starting a new business each year. Today,\nthe small country of Jordan has just over half a million\nentrepreneurs, but it can boast the highest percentage\nof individuals attempting to go it alone. That’s nearly\none in every five adults. The bar graph here illustrates\nthe percentage of the adult population in select countries\nwho are starting new businesses.\n&The Global Economy\nYOU\nSource: 2004 Global Entrepeneurship Monitor (GEM) www.gemconsortium.org\nJordan 18.3%\nIsrael 6.6%\nCanada 8.9%\nUnited Kingdom 6.3%\nSingapore 5.7%\nSouth Africa 5.4%\nGermany 4.5%\nJapan 1.5%\nUnited States 11.3%\nBrazil 13.5%\nSkills Handbook\nSee page R50 to\nlearn about Using\nBar Graphs.\n10 UNIT 1 Fundamental Economic Concepts\nReview\nmost comprehensive measure of a coun-\ntry’s total output and a key measure of a\nnation’s economic health. Economics also\ndescribes jobs, prices, trade, taxes, and gov-\nernment spending.\nDescription allows us to know what the\nworld looks like. However, description is\nonly part of the picture, because it leaves\nmany important “why” and “how” ques-\ntions unanswered.\nAnalysis\nEconomics analyzes the economic activ-\nity that it describes. Why, for example, are\nthe prices of some items higher than oth-\ners? Why do some people earn higher\nincomes than others? How do taxes affect\npeople’s desire to work and save?\nAnalysis is important because it helps us\ndiscover why things work and how things\nhappen. This, in turn, will help us deal with\nproblems that we would like to solve.\nExplanation\nEconomics also involves explanation.\nAfter economists analyze a problem and\nunderstand why and how things work,\nthey need to communicate this knowledge\nto others. If we all have a common under-\nstanding of the way our economy works,\nsome economic problems will be easier to\naddress or even fix in the future. When it\ncomes to GDP, you will soon discover that\neconomists spend much of their time\nexplaining why the measure is, or is not,\nperforming in the manner that is expected.\nPrediction\nFinally, economics is concerned with\nprediction. For example, we may want to\nknow whether our incomes will rise or fall\nin the near future. Because economics is the\nstudy of both what is happening and what\ntends to happen, it can help predict what\nmay happen in the future, including the\nmost likely effects of different actions.\nThe study of economics helps us become\nmore informed citizens and better decision\nmakers. Because of this, it is important to\nrealize that good economic choices are the\nresponsibility of all citizens in a free and\ndemocratic society.\nReading Check Explaining Why is economics\nconsidered to be a social science?\nVocabulary\n1. Explain the significance of scarcity, economics, need,\nwant, factors of production, land, capital, capital good,\nlabor, entrepreneur, and Gross Domestic Product (GDP).\nMain Ideas\n2. Identifying What three basic questions must every\nsociety answer, and why?\n3. Organizing Use a graphic organizer similar to the one\nbelow to identify and describe the factors of production.\nFactor Description\nLand\nCritical Thinking\n4. The BIG Idea How can studying economics help us\nmake better choices about how to use scarce resources?\n5. Synthesizing Information Do you pay to drink from the\nwater fountains at school? Explain why the water is not\nreally free by stating who actually pays for it.\n6. Analyzing Visuals Look at Figure 1.2. Identify and\ncategorize the factors of production for a business you\nknow, such as your place of employment. What would\nhappen if one of these factors was no longer available?\nApplying Economics\n7. Scarcity How does scarcity affect your life? Provide\nseveral examples of items you had to do without\nbecause of limited resources, and explain how you\nadjusted to this situation."
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
      source_url: 'https://i.postimg.cc/CMPz1RpL/IMG-20230927-WA0010.jpg',
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
            voice_id: 'en-US-DavisNeural'
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
