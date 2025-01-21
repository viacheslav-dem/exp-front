/**
 * Created by belous.dmitri on 04.08.2016.
 */

export class HEX {

  private hex: string = "#000000";

  constructor(hex: string) {
    this.hex = (hex.toString().length == 6) ? "#" + hex : (hex.toString().length == 7) ? hex : null;
  }

  public toRGB(): RGB {
    let hexString: string = this.hex.substr(1).toString();
    return new RGB(parseInt(hexString.substr(0, 2), 16), parseInt(hexString.substr(2, 2), 16), parseInt(hexString.substr(4, 2), 16));
  }

  public toString(): string {
    return this.hex;
  }

}

export class RGB {

  private r: number = 0;
  private g: number = 0;
  private b: number = 0;
  private alpha: number = 1;
  private value: number = 0;

  constructor(r: number, g: number, b: number, alpha?: number) {
    this.setRed(r).setGreen(g).setBlue(b);
    if (alpha != null) {
      this.setAlpha(alpha);
    }
    this.updateValue();
  }

  static fromRgba(rgba: string) {
    let rBegInd = rgba.indexOf('(') + 1;
    let rEndInd = rgba.indexOf(',', rBegInd);
    let gBegInd = rEndInd + 1;
    let gEndInd = rgba.indexOf(',', gBegInd);
    let bBegInd = gEndInd + 1;
    let bEndInd = rgba.indexOf(',', bBegInd);
    let aBegInd = bEndInd + 1;
    let aEndInd = rgba.indexOf(')');
    return new RGB(
      +rgba.slice(rBegInd, rEndInd).trim(),
      +rgba.slice(gBegInd, gEndInd).trim(),
      +rgba.slice(bBegInd, bEndInd).trim(),
      +rgba.slice(aBegInd, aEndInd).trim()
    );
  }

  private static getHexPart(v: number): string {
    let h: string = v.toString(16);
    return (h.length > 1) ? h : "0" + h;
  }

  public updateValue(): RGB {
    this.value = (this.getRed() + this.getGreen() + this.getBlue());
    return this;
  }

  //noinspection JSUnusedGlobalSymbols
  public getValue(): number {
    return this.value;
  }

  public toHex(): HEX {
    let hexString: string = (this.getAlpha() < 1) ? this.toHexAlpha().toString() : "#" + RGB.getHexPart(this.getRed()) + RGB.getHexPart(this.getGreen()) + RGB.getHexPart(this.getBlue());
    return new HEX(hexString);
  }

  public toHexAlpha(light: boolean = true): HEX {
    let tmpRgb: RGB = new RGB(this.getRed(), this.getGreen(), this.getBlue());
    if (this.getAlpha() < 1) {
      let tmp: number = (1 - this.getAlpha());
      tmpRgb.setRed(tmpRgb.getRed() * tmp);
      tmpRgb.setGreen(tmpRgb.getGreen() * tmp);
      tmpRgb.setBlue(tmpRgb.getBlue() * tmp);
    }
    let adjustValue: number = (this.getAlpha() < 1) ? Math.floor(255 * this.getAlpha()) : 0;
    return (light) ? tmpRgb.lighten(adjustValue).toHex() : tmpRgb.darken(adjustValue).toHex();
  }

  public setRed(value: number): RGB {
    this.r = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getRed(): number {
    return this.r;
  }

  public setGreen(value: number): RGB {
    this.g = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getGreen(): number {
    return this.g;
  }

  public setBlue(value: number): RGB {
    this.b = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
    return this.updateValue();
  }

  public getBlue(): number {
    return this.b;
  }

  public setAlpha(a: number): RGB {
    this.alpha = (a <= 1 && a >= 0) ? a : 1;
    return this;
  }

  public getAlpha(): number {
    return this.alpha;
  }

  public lighten(by: number): RGB {
    this.setRed(255 - (255 - this.getRed()) * by)
      .setBlue(255 - (255 - this.getBlue()) * by)
      .setGreen(255 - (255 - this.getGreen()) * by);
    return this.updateValue();
  }

  public darken(by: number): RGB {
    this.setRed(this.getRed() * by)
      .setBlue(this.getBlue() * by)
      .setGreen(this.getGreen() * by);
    return this.updateValue();
  }

  public toString(): string {
    return (this.alpha < 1) ? 'rgba(' + this.getRed() + ',' + this.getGreen() + ',' + this.getBlue() + ',' + this.getAlpha() + ')' : 'rgb(' + this.getRed() + ',' + this.getGreen() + ',' + this.getBlue() + ')';
  }

}

export class Color {

  private hex: HEX;
  private rgb: RGB;

  constructor(color: (HEX | RGB)) {

    if (color instanceof HEX) {
      this.hex = color;
      this.rgb = color.toRGB();
    } else if (color instanceof RGB) {
      this.rgb = color;
      this.hex = color.toHex();
    }

  }

  //noinspection JSUnusedGlobalSymbols
  public lighten(by: number): Color {
    this.rgb = this.rgb.lighten(by);
    this.hex = this.rgb.toHex();
    return this;
  }

  //noinspection JSUnusedGlobalSymbols
  public darken(by: number): Color {
    this.rgb = this.rgb.darken(by);
    this.hex = this.rgb.toHex();
    return this;
  }

  public toString(rgb: boolean = true): string {
    return (rgb) ? this.rgb.toString() : this.hex.toString();
  }

  public setAlpha(a: number): Color {
    this.rgb.setAlpha(a);
    this.hex = this.rgb.toHex();
    return this;
  }

}

export class ColorPool {

  //noinspection SpellCheckingInspection
  static colorPool = [
    new Color(new HEX("#665D1E")),
    new Color(new HEX("#5D8AA8")),
    new Color(new HEX("#00308F")),
    new Color(new HEX("#3B7A57")),
    new Color(new HEX("#841B2D")),
    new Color(new HEX("#915C83")),
    new Color(new HEX("#FF9966")),
    new Color(new HEX("#6E7F80")),
    new Color(new HEX("#006A4E")),
    new Color(new HEX("#7C0A02")),
    new Color(new HEX("#2E5894")),
  ];
  static colorPoolIndex = 0;

  static generateColor(): string {
    if (this.colorPoolIndex == this.colorPool.length) {
      this.colorPoolIndex = 0;
    }
    return this.colorPool[this.colorPoolIndex++].toString();
  }

  static generateColors(size: number): string[] {
    let colors: string[] = [];
    for (let i = 0; i < size; ++i) {
      colors.push(ColorPool.generateColor().toString());
    }
    return colors;
  }

  static monochromeColors(baseColor: RGB, size: number): string[] {
    let colors: string[] = [];
    let color = new RGB(baseColor.getRed(), baseColor.getGreen(), baseColor.getBlue(), baseColor.getAlpha());
    for (let i = 0; i < size; ++i) {
      colors.push(color.toString());
      color.lighten(1 - 1.0 / size);
    }
    return colors;
  }
}
