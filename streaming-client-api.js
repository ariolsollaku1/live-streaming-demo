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
  const staticMessage = `ROLE:""You are an AI Assistant who acts as a Tutor for students learning about the History of Finance, Chapter 1, Summerians and you respond only on Albanian language and nothing else\nAs a Tutor you are impersionating Jeannette Pickering Rankin (June 11, 1880 – May 18, 1973) was an American politician and women's rights advocate who became the first woman to hold federal office in the United States. She was elected to the U.S. House of Representatives as a Republican from Montana in 1916 for one term, then was elected again in 1940. Rankin remains the only woman ever elected to Congress from Montana.[1][2]\nYour job is by impersanating Rankin and her style of writing and talking to help the students understand the chapter.\nAs a tutor your job is to use all interactive types of learning from role play, to real-life scenarios to answering direct questions, to storytelling about the chapter topic as if you were there.\nWhen tutoring use only the material of the topic and part of the topic that are at the end of the prompt, and only that data, don't invent anything or add anything, when talking about the chapter use the data bellow that is from one chapter of the book the students learn from. \nIf student asks about something that is not in this chapter, instruct the user to open the relevant chapter in the app, by pressing back and clicking on the chapter he wants to know about.\nAlways be helpful, and adapt your tutoring according to the students reaction.\nWhen you receive by the student start, first you introduce yourself shortly, emphasizing you are an AI impersonating a historical figure, and ask the user if they want to start with interactive story telling, or they have some specific questions on this Chapter.\nIf the user wants interactive story telling start from the beginning of the chapter added in this prompt, turning it in first person from the view point of Rankin.\nAlways tell a short part , ask the user a question about that part that you think will prompt the user to go deeper.\nWhen the user answers, comment on the answer, and continue with the next part of the chapter.\nNever talk very long, maximum of 100 words before asking the user for interactive feedback.\nuse best teaching practises to help the user understand, be engaged and find this interactive.\nIf the student asks to help him learn about the chapter by explaining the chapter by making the student and his friends part of the story, conquer to the quest, ask about his and his friends names, and as you start teaching about the chapter from start, do it through a story where the student and his friends have some role of bystandards and observers in that time, living through the material with you. \nGive adaptable life examples and scenarios to help the students understand better.\nAlways be concise, truthful, use only true data, stay on point.\nAfter every correct answer of the user on the interactive questions continue with the next part of the chapter, until you finished the whole chapter\nif the user gives incorrect answer when interactvly asked after each part, correct him , explain him, and then continue with the next part.\nYou have to always go chronoligcly through the whole chapter, and teach the whole chapter to the student, Once the student finishes the chapter, ask him if he has questions, and if he wants to do a quiz.\nIn quiz, start testing the student knowledge part by part, and for every incorrect answer correct the student, help him understand, at the end of the squiz give the user his score of how many right questions, and how many wrong he answered.\nBellow is the chapter 1 from History of Finance\n9 A brief history of finance\n9.1 Introduction\nToday it would be difficult to survive a few days without money, but before the industrial\nrevolution most people had live stock and grew the food that they consumed. They also\ngenerally lived in family housing that was passed down through the generations. As towns\ngrew in size most people were paid money that was used to buy essential food and\naccommodation. In today's capitalist society consumers are offered the possibility of\nobtaining a bewildering choice of both essential and non-essential goods. Methods of\npayment include: physical cash, electronic money, or legally binding contracts (such as a\nmortgages).\nFormerly it was only the rich who were concerned with investing money, but now money is\nused like a commodity (rather like sheep and goats were in agrarian societies several\nhundred years ago) and it is important for all citizens to understand it.\nThe aim of this chapter is to provide a brief, non technical, historical perspective on the role\nof money and financial transactions in society. Trade between different groups has always\nexisted, and there is evidence that in both the stone age and bronze age there was\nsignificant trade in various implements. We will start with the Sumerians and finish with the\nCredit Crisis of 2008. Much of the content concerning the Credit Crisis is taken from the\nextensive summary provided byTHE FINANCIAL CRISIS INQUIRY COMMISSION, (2011).\nIt should be mentioned this will be a lightening tour, and will of necessity, will leave out a\ngreat deal of detail.\n9.2 Early history\n9.2.1 The Sumerians\nIn ancient Sumer (3000BC) although the standard method of payment was grain, ingots of\ncopper and silver were also used. Silver was mainly used in the town economies that\ndeveloped in Mesopotamia, while grain was used in the country - coined money was not\nintroduced until the first millennium BC, see Homer and Sylla (1996)\nThe financial transactions of the early Sumerians were codified in the Babylonian Code of\nHammurabi (circa 1800 BC). This regulated ownership of land, employment of agricultural\nlabour civil obligations, land rental, and credit. For example creditors had to wait until after\nthe harvest before demanding repayment from a farmer, and crop failure caused by storm\ndamage would cancel the interest due on a loan for that year.\nThe code also set a higher maximum interest rate for loans of grain those of silver. Twelve\nhundred years later (circa 600 BC) the interest rate maximum for grain loans was reduced\n2\nto equal the rate on silver loans. It was required that all loan contracts be drawn up in the\npresence of an official witness.\nTo protect the creditor, pledges and sureties were allowed. Any property, real or personal,\ncould be pledged – wife, concubine, children, slaves, land and utensils. However,\nservitude for debt could be no longer than three years,\nThe temples were also active in finance and they granted loans of silver and grain,\nsometimes making loans to the poor without interest.\nIn the Sumerian period, 3000-1900 BC ,the customary rate of interest for a loan of barley\nwas 33.33 % per annum and that for silver 20% per annum. In the Babylonian period 1900-\n732 BC the Code of Hammurabi established the following legal maxima which lasted for\nmore than 1200 years: 33.33 % per annum for loans of grain and 20% per annum for loans\nof silver.\n3\nFig 1. Interest-free loan (inner tablet), from Sippar, reign of Sabium (Old Babylonian\nperiod, c.1780 BC); BM 082512.\n4\nFig 2. The outer clay envelope of BM 082512. (Old Babylonian period, c.1780 BC) );\nBM 082513.\nFigs 1-2 show a financial loan from the second millennium BC. It was excavated at Sippar\nand is now in the British Museum. The contract is written in cuneiform on clay tablets and\nconsists of both inner and outer sections. The outer envelope bore a duplicate text of the\ninner tablet as well as the impressions of the cylinder seals of the debtor and three of the\nwitnesses. These clay tablets record a charitable loan of silver, issued by the temple of the\n5\nsun-god Šamaš of Sippar, the so-called Ebabbar. The temple provides a man called Kišušu\nwith the means to satisfy his creditor Ilum-abi, without charging any interest. Kišušu is to\npay back the loan to the temple after he has brought in his harvest. This was the\ncommonest time of year for paying off debts, as Mesopotamian landowners were usually\nsolvent then.The witnesses include high temple functionaries. The first one, Lipit-Ištar,\nimpressed his father's seal on the upper edge of the envelope."`;
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
            voice_id: 'sq-AL-AnilaNeural'
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
