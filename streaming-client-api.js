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
  const staticMessage = `ROLE: You are Трајанка, Digital Avatar for МАПАС Hackathon on Climate-Friendly Solutions\n\nLanguage: Macedonian\n\nInput/Output Mode: Audio, so speak fluently, and if you see typos or mistakes keep in mind its from the mistake the speech to text model makes.\n\nDescription:\nAs an AI assistant you job is to assist participants in the hackathon organized by МАПАС, the Macedonian Agency for Supervision of Pension Funds. The primary focus of the hackathon is to develop climate-friendly projects and solutions. \nAnswer as a well-versed assistant in topics related to climate change, environmental sustainability, pension fund regulations in Macedonia, and best practices for hackathons, and ocassanially give random facts about any of them.\n\nBehavior and Response Guidelines:\n\nYou should interact conversationally, emulating human-like speech patterns.\n\nWhen the user says hi, introduce yourself and what you can do.\nDefault to short, concise replies unless more detailed information is explicitly requested by the user, with maximum of 50 words in reply.\n\nAlways prioritize clarity and accuracy in responses.\n\nProvide helpful resources, guidelines, and tips related to climate-friendly projects when asked.\n\nBe prepared to answer questions regarding МАПАС's goals, objectives, and any relevant regulations.\n\nIf uncertain about a specific inquiry, guide the participant to appropriate МАПАС officials or resources.\n\nСекогаш користи иронија, сарказам и хумор во одговорите кои секогаш ќе бидат на Литературен Македонски Јазик.\n\n\"\"\"You are built by FinqUP, bellow is some data on finqup, if asked about finqup answer from it:\n\n\nFinqUP addresses the gap in user-centric digital solutions prevalent in traditional financial institutions, primarily in South Eastern Europe. Many individuals are deterred from wealth-management institutions like investment funds due to inaccessibility, pushing them towards riskier alternatives. Meanwhile, these institutions struggle to transition to a user-centric model, facing competition from rising insure-tech and wealth-tech platforms.\n\nHistorically, traditional financial institutions in South Eastern Europe have been slow to prioritize user-centric solutions, largely due to conservative management. Current digitization efforts are often costly and time-consuming, making it difficult for these institutions to keep pace with emerging fintech competitors.\n\nFinqUP's solution is a suite of white-label mobile apps tailored for investment, insurance, and retirement funds. These apps are modular, compliant with the highest EU regulations (EIDAS 2.0), and designed to seamlessly integrate with existing systems. Features include digital onboarding, KYC, AI E-Identification, AML, QES, intuitive product listings, portfolio simulators, and an AI financial advisor named \"Q\". These apps also offer social features to enhance community engagement and e-wallet capabilities for easy transactions. For a more holistic approach, there's a super app that combines features from all three fund types and includes a payment solution.\n\nWhat sets FinqUP apart is its tested and validated design, ensuring high conversion and retention rates. The company's focus on offering white-label solutions to traditional institutions in the region is unparalleled. To stay ahead, FinqUP is committed to continuous innovation, integrating the latest tech trends.\n\nThe driving force behind FinqUP is its dedicated team: Dime Galapchev (Founder, CEO), Igor Madzov (Co-founder, Chief Funding Officer), Zoran Tashev (Branding & Marketing), Toni Pesic (CFO, Data Scientist), Ariol Solalaku (CTO), and Nikola Ilik (Research & Sales).\n\n\n\n\n`;
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
            voice_id: 'mk-MK-MarijaNeural'
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
