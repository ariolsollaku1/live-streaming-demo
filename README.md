# Streaming Live Demo by D-ID

## Initial Setup:
* (install express) open a terminal in the folder and run  - npm install express
* (add your api key) edit the `api.json` inside the uncompressed folder and replace the emoji with your key


## Start the demo:
* (bring up the app) in the folder (ctr left click on folder through finder) open the terminal run node app.js 
* You should see this message - server started on port localhost:3000
* (open the app) in the browser add localhost:3000
* (connect) press connect you should see the connection ready 
* (stream) press the start button to start streaming

## App:
![app](./app.png)


Karl is in 'main' branch
'main-pension-branch' - for elderly people
main-lady - madam smith. 

we start the project by 'npm run dev'


1 - if you want to change the configuration of openai chat go to app.js (line 21)
2 - changing the conversation history streaming-client-api.js (line: 71)

the conversation history is saved in streaming-client-api.js (line: 87) (conversationHistory)

how to manipulate the images and video
change background image streaming-client-api.js (line: 33)

in order to overlap the video being streamed in the right position focus on the streaming-client-api.js (line: 58)      
ctx.drawImage($this, 94, 120, 319, 322);

The first two numbers are where the video is anchored (left, top) 
The second two numbers is the size of the video (width, height)

To change the video avatar, first upload the image from postman, after that change source_url in streaming-client-api.js (line: 114). It should be the same as the url in postman body.



## build image
docker build -t digitsapiens/live_streaming_demo:universal-avatar-q .

## push image
docker push digitsapiens/live_streaming_demo:universal-avatar-q

## pull image
docker pull digitsapiens/live_streaming_demo:universal-avatar-q

## run container (first time)
## run the docker image. Expose the port 4100 to the host machine on port 3300
docker run -p 3031:3030/tcp --name "digitsapiens_live_streaming_demo" digitsapiens/live_streaming_demo:universal-avatar-q

## update container
docker pull digitsapiens/live_streaming_demo:universal-avatar-q && \
docker stop digitsapiens_live_streaming_demo && \
docker rm digitsapiens_live_streaming_demo && \
docker run -p 3300:4100/tcp --name "digitsapiens_live_streaming_demo" digitsapiens/live_streaming_demo:universal-avatar-q &

## stop container && rmeove container
docker stop digitsapiens_live_streaming_demo && docker rm digitsapiens_live_streaming_demo

## check containers
docker ps -a