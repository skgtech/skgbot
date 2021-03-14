/**
 * @fileoverview Template for member verification.
 */

const tpl = (module.exports = {});

tpl.render = (header, body) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SKGTech Member Verification</title>
    <!--[if IE]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <style>
      article, aside, details, figcaption, figure, footer, header,
      hgroup, menu, nav, section { display: block; }
    </style>
  </head>
  <body>
    <h1>${header}</h1>
    <p>${body}</p>
  </body>
</html>
`;
