export const generateCodeOfScript = (script: string) =>
  `<span style={{display: 'inline-block', width: 0, height: 0, padding: 0, margin: 0}} dangerouslySetInnerHTML={{__html: \`<script>${script}</script>\`}} />`;
