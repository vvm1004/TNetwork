import React from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const RoomPage = () => {

    const { roomID } = useParams()
    const currentUser = useRecoilValue(userAtom);

    const myMeeting = async (element) => {
        // generate Kit Token
        const appID = 414387900;
        const serverSecret = "d80aa22aabbabc3521ab5b154df52558";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, currentUser._id, currentUser.username);


        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url:window.location.href
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
            },
        });
    }
    return (
<div
      className="myCallContainer"
      ref={myMeeting}
    //   style={{ width: '100vw', height: '100vh' }}
    ></div>    )
}

export default RoomPage