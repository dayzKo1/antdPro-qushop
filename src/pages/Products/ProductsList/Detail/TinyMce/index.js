// /* eslint-disable no-dupe-keys */
// /* eslint-disable no-multi-str */
// import React from 'react';
// import { Editor } from '@tinymce/tinymce-react';
// import axios from 'axios';
// import 'tinymce/tinymce';
// import 'tinymce/themes/silver';
// import 'tinymce/plugins/preview';
// import 'tinymce/plugins/autoresize';
// import 'tinymce/plugins/autosave';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/hr';
// import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/lists';
// import { message } from 'antd';
// import { tr } from '@/utils/utils';
// // 引入官方国际化文件，下载地址https://www.tiny.cloud/get-tiny/language-packages/
// // 随着版本更新可能部分新功能未进行国际化翻译需要自行到对应js添加
// import './zh_CN';

// class TinyMce extends React.Component {
//   // 绑定富文本
//   // 当tinymce更新版本后需要将tinymce包内的skins icons文件夹拷贝到public中否则会导致图标异常
//   handleChange = content => {
//     const { onChange } = this.props;
//     onChange(content);
//   };

//   render() {
//     const { value } = this.props;
//     const i18n = localStorage.getItem('umi_locale') === 'en-US' ? {} : { language: 'zh_CN' };
//     return (
//       <Editor
//         initialValue={value}
//         onEditorChange={this.handleChange}
//         onSetContent={this.setcontent}
//         init={{
//           ...i18n,
//           min_height: 370,
//           width: '100%',
//           max_height: 570,
//           branding: false,
//           autosave_ask_before_unload: false,
//           menubar: false,
//           plugins:
//             'preview autoresize autolink fullscreen image link media code table hr advlist lists ',
//           toolbar:
//             'fontselect fontsizeselect formatselect lineheight forecolor  backcolor bold italic underline strikethrough image media table alignleft aligncenter alignright alignjustify outdent indent bullist numlist removeformat hr  code link undo redo preview fullscreen',
//           images_upload_handler(blobInfo, succFun) {
//             const file = blobInfo.blob();
//             const formData = new FormData();
//             formData.append('files[]', file, file.name);
//             const isLt8M = file && file.size / 1024 / 1024 < 8;
//             if (isLt8M) {
//               axios({
//                 method: 'post',
//                 url: '/api/admin/attachments?format=object',
//                 data: formData,
//                 headers: { 'Content-Type': 'multipart/form-data' },
//               })
//                 .then(res => {
//                   succFun(res[0].url);
//                 })
//                 .catch(error => {
//                   const { response } = error;
//                   message.error(response && response.data && response.data.message);
//                   succFun('');
//                 });
//             } else {
//               succFun('');
//               message.warning(
//                 tr(
//                   'store.imgupload.warn3',
//                   '您的图片尺寸过大，会影响买家的访问速度，请使用8M以下大小的图片',
//                 ),
//               );
//             }
//           },
//           lineheight_formats: '1 1.2 1.5 1.8 2 2.5 3',
//           fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
//           font_formats:
//             '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;',
//         }}
//       />
//     );
//   }
// }

// export default TinyMce;
