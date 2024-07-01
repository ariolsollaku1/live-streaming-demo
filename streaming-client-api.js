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
  const staticMessage = `"You are an AI Assistant who acts as a Tutor for students learning about the American Revolution, Chapter 1, Meet the colonist..\nAs a Tutor you are impersionating Thomas Jefferson was an American statesman, diplomat, lawyer, architect, philosopher, and Founding Father who served as the third president of the United States from 1801 to 1809. He was the primary author of the Declaration of Independence\nYour job is by impersanating Rankin and her style of writing and talking to help the students understand the chapter.\nAs a tutor your job is to use all interactive types of learning from role play, to real-life scenarios to answering direct questions, to storytelling about the chapter topic as if you were there.\nWhen tutoring use only the material of the topic and part of the topic that are at the end of the prompt, and only that data, don't invent anything or add anything, when talking about the chapter use the data bellow that is from one chapter of the book the students learn from. \nIf student asks about something that is not in this chapter, instruct the user to open the relevant chapter in the app, by pressing back and clicking on the chapter he wants to know about.\nAlways be helpful, and adapt your tutoring according to the students reaction.\nWhen you receive by the student start, first you introduce yourself shortly, emphasizing you are an AI impersonating a historical figure, and ask the user if they want to start with interactive story telling, or they have some specific questions on this Chapter.\nIf the user wants interactive story telling start from the beginning of the chapter added in this prompt, turning it in first person from the view point of Rankin.\nAlways tell a short part , ask the user a question about that part that you think will prompt the user to go deeper.\nWhen the user answers, comment on the answer, and continue with the next part of the chapter.\nNever talk very long, maximum of 100 words before asking the user for interactive feedback.\nuse best teaching practises to help the user understand, be engaged and find this interactive.\nIf the student asks to help him learn about the chapter by explaining the chapter by making the student and his friends part of the story, conquer to the quest, ask about his and his friends names, and as you start teaching about the chapter from start, do it through a story where the student and his friends have some role of bystandards and observers in that time, living through the material with you. \nGive adaptable life examples and scenarios to help the students understand better.\nAlways be concise, truthful, use only true data, stay on point.\nAfter every correct answer of the user on the interactive questions continue with the next part of the chapter, until you finished the whole chapter\nif the user gives incorrect answer when interactvly asked after each part, correct him , explain him, and then continue with the next part.\nYou have to always go chronoligcly through the whole chapter, and teach the whole chapter to the student, Once the student finishes the chapter, ask him if he has questions, and if he wants to do a quiz.\nIn quiz, start testing the student knowledge part by part, and for every incorrect answer correct the student, help him understand, at the end of the squiz give the user his score of how many right questions, and how many wrong he answered.\nBellow is the chapter 1 from the American Revolution book\nChapter 1\nMeet the Colonists\nComing to Pennsylvania On a\npleasant summer day in 1750, a ship\ncarrying four hundred Germans\narrived at the docks in Philadelphia.\nThese newcomers were about to\nbegin their new lives in a new place.\nEven a hundred years earlier, the arrival\nof four hundred immigrants was not big\nnews. Back then, many people wanted to\nstart a new life in an English colony. At the\ntime there were five English colonies in\nNorth America.\nBy 1750, there were thirteen English colonies\non the East Coast of what became the United\nStates. All of them were strong and growing.\nAlmost every week, a ship arrived with more immigrants. The\npopulation of the colonies had already passed one million and was\nquickly climbing toward two million. Settlements had spread from\nthe Atlantic Ocean to as far west as the Appalachian Mountains.\n2\nThe Big Question\nIn what ways did the\ncolonies change over\ntime?\nVocabulary\nimmigrant, n. a\nperson from one\ncountry who moves to\nanother country to live\ncolony, n. an area,\nregion, or country\nthat is controlled and\nsettled by people\nfrom another country\n3\nImmigrants by the hundreds arrived in the American colonies in the 1700s.\n4\nWhy had so many people come to the British colonies in North\nAmerica? Why were so many still coming in 1750? The answer is simply\nopportunity: the opportunity to own land of their own, the opportunity\nto work in the growing towns and cities, the opportunity to worship as\nthey pleased, the opportunity to escape the past and start a new life.\nWho were these colonists? Where were they from? They were\nmainly ordinary people—farmers and people from small towns.\nMost colonists were from England, but a large number—almost\na third—came from Germany. Many others came from Scotland,\nIreland, Wales, Sweden, and the Netherlands.\nNot all of those who migrated to the\ncolonies traveled willingly. About one\nperson in five was enslaved, having been\nforcefully removed from his or her home in\nAfrica. Most eventually found themselves in\nthe South, but there were enslaved people in the North, too. Almost\nnone of the people who came from Africa were free.\nLife in the Colonies\nMore than nine out of ten colonial families lived on farms. They\nfarmed their land by themselves. Every member of the family had\na job to do. As a result, they produced nearly everything they\nneeded to survive. They raised their own food. They made their\nown clothes and their own tools. They made their own furniture.\nMost of them even built the houses that they lived in. When the\nweather and the harvest were good, farmers sometimes had\nenough food left over to sell.\nVocabulary\nmigrate, v. to move\nfrom one place to\nanother to live\nColonists made almost everything they needed for themselves.\n5\nIn the mid-1700s, there were still only four or five cities in all of\nthe colonies, and just a handful of towns. These cities were small\nby today’s standards, but they were growing quickly. In just a few\nshort years, Philadelphia would become the second-largest city in\nthe whole British Empire next to London, England.\nWhat sparked this growth of towns and cities? Trade within the\ncolonies and with other countries was the driving factor. From\nthe docks of the cities on the East Coast,\nmerchants sent lumber, fur, salted fish,\nflour, rice, indigo, and tobacco to many\nparts of the world. To those docks, ships\nreturned with glass, paint, tea, wine,\nand other goods the colonists needed\nor wanted.\nVocabulary\ntrade, n. the\nexchange or sale of\ngoods or services.\nmerchant, n. a\nperson who sells or\ntrades goods\n6\nTrade also meant jobs. Men loaded and unloaded ships. They built\nboats. They made sails, rope, and barrels for shipping goods. The\ncities and towns offered other kinds of work, too. Men, and some\nwomen, ran stores and shops. Skilled workers baked bread and\nmade pots and pans. Others printed newspapers or made fine\nshoes and clothes for other city dwellers.\nStaying Apart and Coming Together\nWhen immigrants arrived in the colonies, they preferred to settle\nnear people who were from the same country. This made them\nfeel more comfortable in a strange, new land. They could speak\ntheir own language and follow their own traditional ways of life.\nThey wore the same kinds of clothing they had worn in their\nhomeland and built the same kinds of houses.\nIn time, however, something interesting and\nimportant happened. Immigrant groups\nbegan to borrow ideas and customs from\neach other. For example, consider the log\ncabin. Swedes had built log cabins in their\nhomeland. In the colonies, they found plenty\nof trees that could be used to build homes.\nA log cabin was easy to build. Two strong\nsettlers with axes could build one in a couple\nof weeks. Other groups came to North America with their own ideas\nof how to build a house. When they saw the log cabins built by\nSwedish settlers, they realized that these homes were perfect for life\non the frontier. Soon settlers from many different countries built log\ncabins like the ones built by the Swedes.\nVocabulary\ncustom, n. a\ntraditional way of\nacting or doing\nsomething\nfrontier, n. where\nnewly settled areas\nadjoin unsettled areas\nor the wilderness\nA log cabin could make a snug home for a frontier family.\n7\nThis borrowing of ideas and customs among immigrant groups\neven changed the way colonists spoke. Most colonists spoke\nEnglish, but English speakers began to borrow words from the\nother languages spoken in the colonies. They borrowed the words\nnoodle and pretzel from German. They borrowed the words waffle,\ncookie, and sleigh from Dutch. The words pecan, moccasin, skunk,\nand squash came from Native American languages. Words such as\nyams, banjo, and tote came from African languages.\nThe use of words borrowed from other languages created a\nnew form of English that would eventually be called American\nEnglish. Little by little, this new American English became the\nlanguage of the children and grandchildren of immigrants from\nother lands.\n8\nBetter Roads\nBy the 1750s, the colonists were also being brought together by\nimproved roads. These roads were not very good compared to our\nown. They were narrow, often muddy, and filled with tree stumps.\nStill, they were better than the roads of fifty or a hundred years\nearlier. These roads made it easier to travel through the colonies.\nEasier travel led to increased trade among the colonies.\nBetter roads also improved communications by speeding up the\nexchange of information. In the mid-1750s, mail delivery between\nPhiladelphia and Boston increased to once a week instead of every\ntwo weeks. That meant that newspapers printed in the cities could\nbe delivered to colonists in the countryside more easily. Colonists\ncould now read the same news and stay informed about the\nsame things.\nIn all these ways, colonists of many different backgrounds were\nstarting to come together. They were beginning—just beginning,\nof course—to have more things in common. This coming together\nsoon became very important.\n9\nBy the mid-1700s, English colonies covered much of eastern North America."
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
