import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export const initializeZegoCloud = async (roomId, userId, userName) => {
  const appID = 2030731488;
  const serverSecret = 'bc0fb9a32a2db1941c02ecc00521f5c1';

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomId,
    userId,
    userName
  );

  const zp = ZegoUIKitPrebuilt.create(kitToken);
  
  return zp;
};
