import {
  INLINE_PREVIEW_MIME_TYPES,
  getAttachmentPreviewKind,
  getDownloadLabel,
  isSafePreviewUrl,
} from '../attachmentPreview';

describe('getAttachmentPreviewKind', () => {
  it.each([...INLINE_PREVIEW_MIME_TYPES])('renders %s inline as an image', (mime) => {
    expect(getAttachmentPreviewKind(mime)).toBe('image');
  });

  it('normalizes case and parameters before deciding', () => {
    expect(getAttachmentPreviewKind('IMAGE/PNG; charset=x')).toBe('image');
  });

  it.each(['application/pdf', 'text/plain', 'image/svg+xml', 'text/html'])(
    'falls back to download for %s',
    (mime) => {
      expect(getAttachmentPreviewKind(mime)).toBe('download');
    },
  );

  it.each([undefined, null, '', 'application/x-unknown'])(
    'falls back to download for unknown or missing type %p',
    (mime) => {
      expect(getAttachmentPreviewKind(mime)).toBe('download');
    },
  );
});

describe('isSafePreviewUrl', () => {
  it.each(['https://cdn.example.com/a.png', 'blob:https://app.example.com/1234'])(
    'accepts %s',
    (url) => {
      expect(isSafePreviewUrl(url)).toBe(true);
    },
  );

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'http://insecure.example.com/a.png',
    '/relative/path.png',
    'not a url',
    '',
  ])('rejects %p', (url) => {
    expect(isSafePreviewUrl(url)).toBe(false);
  });

  it('rejects missing URLs', () => {
    expect(isSafePreviewUrl(undefined)).toBe(false);
    expect(isSafePreviewUrl(null)).toBe(false);
  });
});

describe('getDownloadLabel', () => {
  it('includes the file name', () => {
    expect(getDownloadLabel('notes.pdf')).toBe('Download notes.pdf');
  });

  it('uses a generic label when the name is blank', () => {
    expect(getDownloadLabel('   ')).toBe('Download attachment');
  });
});
