const AWS = require('aws-sdk');
const medialive = new AWS.MediaLive({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1'
});

const mediaPackage = new AWS.MediaPackage({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1'
});

const mediaPackageV2 = new AWS.MediaPackage({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1'
});



const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
});


function configureBucket() {
  return new Promise((resolve, reject) => {

    s3.createBucket({ Bucket: process.env.AWS_BUCKET }, (err, data) => {
      if (err) {
        if (err.code === 'BucketAlreadyOwnedByYou') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        s3.putBucketLifecycleConfiguration({
          Bucket: process.env.AWS_BUCKET,
          LifecycleConfiguration: {
            Rules: [{
              Status: 'Enabled',
              Expiration: { Days: 30 },
              ID: 'Delete after 30 days'
            }]
          }
        }).promise().then(resolve).catch(reject);
      }
    });
  });
}



class StreamingService {
  async getAllChannels() {
    return new Promise((resolve, reject) => {
      medialive.listChannels({}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Channels);
        }
      });
    });
  }

  async getChannel(id) {
    let stream = {};
    let channel = {};
    let endpoints = {};
    let hlsEndpoints = [];
    try {
      stream = await medialive.describeChannel({ ChannelId: id }).promise();
    } catch (e) {
      console.error('stream error', e);
    }
    try {
      channel = await mediaPackage.describeChannel({ Id: stream.Destinations[0].MediaPackageSettings[0].ChannelId }).promise();
      endpoints = await mediaPackage.listOriginEndpoints({ ChannelId: channel.Id }).promise();
    } catch (e) {
      console.error('channel error', e);
    }
    if (endpoints.OriginEndpoints) {
      hlsEndpoints = endpoints.OriginEndpoints.filter(endpoint => endpoint.Url.endsWith('.m3u8'));
    }

    return { stream, channel, hlsEndpoints };
  }

  // async createInput(inputConfig) {

  //   const inputs = await medialive.listInputs({}).promise();
  //   inputs.Inputs.forEach(input => {
  //     if (input.Name === inputConfig.Name) {
  //       return input;
  //     }
  //   });

  //   const params = {
  //     Name: inputConfig.name,
  //     Type: inputConfig.type || 'RTMP_PUSH',
  //     Sources: [
  //       {
  //         Url: inputConfig.url,
  //         Username: inputConfig.username,
  //         PasswordParam: inputConfig.passwordParam
  //       }
  //     ],
  //     Destinations: [
  //       {
  //         StreamName: inputConfig.streamName
  //       }
  //     ],
  //     SecurityGroups: [1597317]
  //   };




  //   try {
  //     const response = await medialive.createInput(params).promise();
  //     return response.Input
  //   } catch (error) {
  //     console.error('Error creating input:', error);
  //   }
  // }


  // async createChannel(channelConfig) {

  //   /**@type {import('aws-sdk/clients/medialive.js').CreateChannelRequest} */
  //   const channel = {
  //     Name: channelConfig.name,
  //     ChannelClass: 'SINGLE_PIPELINE',
  //     Tags: {
  //       Name: channelConfig.name,
  //     },
  //     RequestId: channelConfig.name,
  //     InputSpecification: {
  //       Codec: 'AVC',
  //       Resolution: 'HD',
  //       MaximumBitrate: 'MAX_10_MBPS',
  //     },
  //     InputAttachments: [{
  //       InputId: inputArn,
  //       InputSettings: {
  //         SourceEndBehavior: 'LOOP',
  //         NetworkInputSettings: {
  //           ServerValidation: 'CHECK_CRYPTOGRAPHY_AND_VALIDATE_NAME'
  //         }
  //       }
  //     }],
  //     Destinations: [{
  //       Id: 'storage-destination',
  //       Settings: [{
  //         Url: 's3://your-bucket-name',
  //       }]
  //     }]
  //   }



  //   return new Promise((resolve, reject) => {
  //     medialive.createChannel(channel, (err, data) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  // }

  async startChannel(id) {
    return new Promise((resolve, reject) => {
      medialive.startChannel({ ChannelId: id }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async stopChannel(id) {
    return new Promise((resolve, reject) => {
      medialive.stopChannel({ ChannelId: id }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async deleteChannel(id) {
    return new Promise((resolve, reject) => {
      medialive.deleteChannel({ ChannelId: id }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}




export const streamingService = new StreamingService();