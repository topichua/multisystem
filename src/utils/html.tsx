export function replaceNewlinesWithBrTags(text: string): string {
  return text.replace(/\n/g, '<br />');
}

export function removeLeadingTrailingBRTags(html: string): string {
  const regex = /^(\s*\n*<br\s*\/?>\s*)+|(<br\s*\/?>\s*\n*)+$/g;
  return html.replace(regex, '');
}

export function replaceConsecutiveBRTags(html: string): string {
  const regex = /(<br\s*\/?>\s*\n*)+/gi;
  return html.replace(regex, '<br />');
}

export function removeLeadingTrailingEmptyPTags(html: string): string {
  // Pattern to match empty leading and trailing <p> tags with optional spaces, &nbsp or <br/> tags
  const pattern =
    /^(\s*<p>(?:&nbsp;|<br\s*\/?>)*<\/p>\s*)+|(<p>(?:&nbsp;|<br\s*\/?>)*<\/p>\s*)+$/gm;

  // Replace empty leading and trailing <p> tags with an empty string
  var outputString = html.replace(pattern, '');

  return outputString;
}

// You can add logs by using console.log
export function removeNewlinesAfterClosingTags(html: string) {
  // Replace newline characters following a closing HTML tag with a space
  const modifiedHtml = html.replace(/>\n/g, (match) => match.replace('\n', ''));
  return modifiedHtml;
}

export function replaceMultipleSpacesBetweenTags(html: string) {
  // Replace any amount of spaces between HTML tags with a single space
  const modifiedHtml = html.replace(/>\s+</g, '> <');
  return modifiedHtml;
}

export function replaceMultipleSpaces(html: string) {
  // Replace any amount of spaces between HTML tags with a single space
  const modifiedHtml = html.replace(/\s+/g, ' ');
  return modifiedHtml;
}

export function removeConsecutiveEmptyPWithBRTags(html: string): string {
  const regex = /(<p>\s*<br\s*\/?>\s*<\/p>\s*\n*)+/gi;

  // Remove <p> with only <br> tags like <p><br/></p>
  return html.replace(regex, '<br />');
}

export function trim(html: string) {
  return html.trim();
}
