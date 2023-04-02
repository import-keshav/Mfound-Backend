const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../credentials/aws-s3');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME_S3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    
    key: function (req, file, cb) {
      let fileName = file.originalname;
      if(fileName == 'No file'){
        cb(1);
      }else{
        switch(file.fieldname){
            case 'donate_image':
            cb(null, "donate/"+fileName+"");
            break;
            case 'lost_image':
            cb(null, "lost/"+fileName+"");
            break;
            case 'found_image':
            cb(null, "found/"+fileName+"");
            break;
            case 'docs_image':
            cb(null, "docs/"+fileName+"");
            break;
            case 'enquiry_image':
            cb(null, "enquiry/"+fileName+"");
            break;
            case 'image':
            cb(null, "profiles/"+fileName+"");
            break;
            case 'thumb_image':
            cb(null, "found/"+fileName+"");
            break;
            case 'wefound_image':
            cb(null, "wefound/"+fileName+"");
            break;
            case 'banners_image':
            cb(null, "banners/"+fileName+"");
            break;
            case 'winners_image':
            cb(null, "winners/"+fileName+"");
            break;
            case 'services_image':
            cb(null, "services/"+fileName+"");
            break;
            case 'prizes_image':
            cb(null, "prizes/"+fileName+"");
            break;
            case 'videos_image':
            cb(null, "videos/"+fileName+"");
            break;
            case 'qr_image':
            cb(null, "qr_image/"+fileName+"");
            break;
            case 'qr_codes':
            cb(null, "qr_codes/"+fileName+"");
            break;
            case 'product_image':
            cb(null, "products/"+fileName+"");
            break;
            case 'product_category':
            cb(null, "products_category/"+fileName+"");
            break;
            default:
            cb(null, "");
          }

      }
      
      
    }
  })
}).any()

module.exports = upload;
