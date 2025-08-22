export class NotificationError {
  link: any[];
  linkText: string;
  fragment?: string;

  constructor(readonly heading: string) {}

  withLink?({ link, linkText, fragment }: Pick<NotificationError, 'link' | 'linkText' | 'fragment'>): this {
    this.link = link;
    this.linkText = linkText;
    this.fragment = fragment;

    return this;
  }
}
