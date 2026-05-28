const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const filePath = 'E:\\AIprepp\\interviewiq\\backend\\uploads\\resume_69e7859633168c9eb8f65ba6_1776784978270.docx';

mammoth.extractRawText({ path: filePath })
  .then(function(result) {
    const text = result.value;
    console.log(text);
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });
