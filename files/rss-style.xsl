<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />
  <xsl:template match="/">
    <xsl:apply-templates select="/rss/channel"/>
  </xsl:template>
  <xsl:template match="/rss/channel">
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content="emergency, alert, warning"/>
      <title><xsl:value-of select="title" /></title>
      <style type="text/css">
        body { 
          font-family: Verdana, Geneva, sans-serif;
          background: #FFFFFF;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        table { font-size:small; }
        td { text-indent:-20px; padding-left:20px }
      </style>
      <link rel="icon" type="image/x-icon" href="favicon.ico" />
    </head>
    <body>
      <h1>
        <img src="{image/url}" alt="logo" width="128px" height="128px"/>
        <xsl:value-of select="title" />
      </h1>
      <table>
        <xsl:apply-templates select="item"/>
      </table>
    </body>
    </html>
  </xsl:template>
  <xsl:template match="rss/channel/item">
      <tr><td><a href="{link}"><xsl:value-of select="title" /></a>
      <em> (<xsl:value-of select="pubDate" />) </em><br/>
      <xsl:value-of select="description" />
      </td></tr>
  </xsl:template>
</xsl:stylesheet>