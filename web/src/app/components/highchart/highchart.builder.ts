/**
 * Created by belous.dmitri on 02.02.2017.
 */
import {NumberPipe} from "@app/pipes/number.pipe";

// noinspection JSUnusedGlobalSymbols
export let Chart = {

  /**
   * For initial declarative chart setup.
   * @param title
   * @returns {ChartBuilder}
   */
  chart: function (title?: string) {
    return new ChartBuilder(title);
  },

  axis: function (title?: string) {
    return new AxisBuilder(title);
  },

  title: function (text?: string) {
    return new TitleBuilder(text);
  },

  labels: function () {
    return new LabelsBuilder();
  },

  exporting: function () {
    return new ExportingBuilder();
  },

  button: function () {
    return new ButtonBuilder();
  },

  legend: function () {
    return new LegendBuilder();
  },

  plotOptions: function (type?: ChartType) {
    return new PlotOptionsBuilder(type);
  },

  series: function (type?: ChartType) {
    return new SeriesBuilder(type);
  },

  histogram: function (type?: ChartType) {
    return new HistogramOptionsBuilder(type);
  },

  barOptions: function (name?: string) {
    return new BarOptionsBuilder(name);
  },

  lineOptions: function (name?: string) {
    return new LineOptionsBuilder(name);
  },

  columnOptions: function (name?: string) {
    return new ColumnOptionsBuilder(name);
  },

  areaOptions: function (name?: string) {
    return new AreaOptionsBuilder(name);
  },

  pieOptions: function (name?: string) {
    return new PieOptionsBuilder(name);
  },

  loading: function () {
    return new LoadingBuilder();
  },

  data: function () {
    return new DataBuilder();
  },

  tooltip: function () {
    return new TooltipBuilder();
  },

  dataLabels: function () {
    return new DataLabelsBuilder();
  },

  valueFormat: function () {
    return new ValueFormatBuilder();
  },

  marker: function () {
    return new MarkerBuilder();
  },

  gradientColor: function () {
    return new GradientColorBuilder();
  },

  responsiveRule: function () {
    return new ResponsiveRuleBuilder();
  },
};

export class ChartBuilder {

  options: any = {
    chart: {},
    plotOptions: {},
    loading: {},
    responsive: {
      rules: [],
    },
    series: []
  };

  constructor(title?: string) {
    if (title) {
      this.title(title);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The chart's main title. Defaults to 'Chart title'.
   * @param title
   */
  title(title?: string | TitleBuilder | any) {
    if (typeof title === 'string') {
      title = {text: title};
    } else if (title instanceof TitleBuilder) {
      title = title.options;
    }
    this.options.title = title;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A configuration object for the tooltip rendering of each single series.
   * Properties are inherited from tooltip, but not all tooltip properties can be defined on a plot options level.
   * The full list of tooltip options can be used on a chart level.
   * @param tooltip
   */
  tooltip(tooltip: TooltipBuilder | any) {
    if (tooltip instanceof TooltipBuilder) {
      tooltip = tooltip.options;
    }
    this.options.tooltip = tooltip;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  onlyChart() {
    return this
      .margin([0, 0, 0, 0])
      .xAxis(Chart.axis()
        .visible(false)
        .minPadding(0)
        .maxPadding(0)
        .crosshair(false))
      .yAxis(Chart.axis()
        .visible(false)
        .endOnTick(false))
      .legend(false)
      .exporting(false);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The distance between the outer edge of the chart and the content, like title, legend, axis title or labels.
   * The numbers in the array designate top, right, bottom and left respectively.
   * Use the options spacingTop, spacingRight, spacingBottom and spacingLeft options for shorthand setting of one option.
   * Defaults to [10, 10, 15, 10].
   * Use spacing() to set the spacing equal [0,0,0,0].
   * @param spacing
   */
  spacing(spacing?: number[]) {
    if (!spacing) {
      spacing = [0, 0, 0, 0];
    }
    this.options.chart.spacing = spacing;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The margin between the outer edge of the chart and the plot area.
   * The numbers in the array designate top, right, bottom and left respectively.
   * Use the options marginTop, marginRight, marginBottom and marginLeft for shorthand setting of one option.
   * By default the actual space is dynamically calculated from the offset of axis labels, axis title, title, subtitle
   * and legend in addition to the spacingTop, spacingRight, spacingBottom and spacingLeft options.
   * Use margin() to set the margin equal [0,0,0,0].
   * @param margin
   */
  margin(margin?: number[]) {
    if (!margin) {
      margin = [0, 0, 0, 0];
    }
    this.options.chart.margin = margin;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * An explicit width and height for the chart. By default the width and height are calculated from the offset width
   * and height of the containing element (height = 400 pixels if the containing element's height is 0).
   * @param width
   * @param height
   */
  size(width?: number, height?: number) {
    this.options.chart.width = width;
    this.options.chart.height = height;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * An explicit width for the chart.
   * By default the width is calculated from the offset width of the containing element.
   * @param width
   * @returns {ChartBuilder}
   */
  width(width?: number) {
    this.options.chart.width = width;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * An explicit height for the chart. By default (when null) the height is calculated from the offset height of
   * the containing element, or 400 pixels if the containing element's height is 0. Defaults to null.
   * @param height
   * @returns {ChartBuilder}
   */
  height(height?: number) {
    this.options.chart.height = height;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The background color or gradient for the outer chart area. Defaults to #FFFFFF.
   * Use backgroundColor(null) to set the transparent color.
   * @param backgroundColor
   */
  backgroundColor(backgroundColor?: string | GradientColorBuilder) {
    if (backgroundColor instanceof GradientColorBuilder) {
      backgroundColor = backgroundColor.options;
    }
    this.options.chart.backgroundColor = backgroundColor;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The default series type for the chart. Defaults to "line".
   * @param type
   */
  type(type: ChartType) {
    this.options.chart.type = type;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The X axis or category axis.
   * Normally this is the horizontal axis, though if the chart is inverted this is the vertical axis.
   * In case of multiple axes, the xAxis node is an array of configuration objects.
   * @param xAxis
   * @param defaultAxis
   */
  xAxis(xAxis: string | AxisBuilder | AxisBuilder[] | any | any[], defaultAxis: boolean = false) {
    if (typeof xAxis === 'string') {
      xAxis = Chart.axis(xAxis);
    }
    if (!this.options.xAxis) {
      this.options.xAxis = [];
    }
    this.prepareAxis(xAxis).forEach(axis => {
      this.options.xAxis.push(axis)
    });
    if (defaultAxis) {
      //noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
      this.options.xAxis = this.options.xAxis[0];
    }
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The Y axis or value axis.
   * Normally this is the vertical axis, though if the chart is inverted this is the horizontal axis.
   * In case of multiple axes, the yAxis node is an array of configuration objects.
   * @param yAxis
   * @param defaultAxis
   */
  yAxis(yAxis: string | AxisBuilder | AxisBuilder[] | any | any[], defaultAxis: boolean = false) {
    if (typeof yAxis === 'string') {
      yAxis = Chart.axis(yAxis);
    }
    if (!this.options.yAxis) {
      this.options.yAxis = [];
    }
    this.prepareAxis(yAxis).forEach(axis => {
      this.options.yAxis.push(axis)
    });
    if (defaultAxis) {
      this.options.yAxis = this.options.yAxis[0];
    }
    return this;
  }

  private prepareAxis(axis: AxisBuilder | AxisBuilder[] | any | any[]): any[] {
    if (!Array.isArray(axis)) {
      axis = [axis];
    }
    axis.forEach((anAxis, index) => {
      if (anAxis instanceof AxisBuilder) {
        axis[index] = anAxis.options;
      }
    });
    return axis;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * When using multiple axis, the ticks of two or more opposite axes will automatically be aligned by adding ticks
   * to the axis or axes with the least ticks, as if tickAmount were specified.
   * This can be prevented by setting alignTicks to false.
   * If the grid lines look messy, it's a good idea to hide them for the secondary axis by setting gridLineWidth to 0.
   * Defaults to true.
   * @param alignTicks
   * @returns {ChartBuilder}
   */
  alignTicks(alignTicks: boolean = true) {
    this.options.chart.alignTicks = alignTicks;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Options for the exporting module.
   * Exporting is enabled by default.
   * @param exporting
   * @returns {ChartBuilder}
   */
  exporting(exporting?: boolean | ExportingBuilder | any) {
    if (exporting == null) {
      exporting = true;
    }
    if (typeof exporting === 'boolean') {
      exporting = {enabled: exporting};
    } else if (exporting instanceof ExportingBuilder) {
      exporting = exporting.options;
    }
    this.options.exporting = exporting;
    return this;
  }

  legend(legend?: boolean | LegendBuilder | any) {
    if (legend == null) {
      legend = true;
    }
    if (typeof legend === 'boolean') {
      legend = {enabled: legend};
    } else if (legend instanceof LegendBuilder) {
      legend = legend.options;
    }
    this.options.legend = legend;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Language object. The language object is global and it can't be set on each chart initiation.
   * Instead, use Highcharts.setOptions to set it before any chart is initiated.
   * @param lang
   * @returns {ChartBuilder}
   */
  lang(lang: any) {
    this.options.lang = lang;
    return this;
  }

  plotOptions(plotOptions: PlotOptionsBuilder | any, type?: ChartType) {
    let plotOptionsType: string = type;
    if (plotOptionsType == null) {
      plotOptionsType = plotOptions.type;
    }
    if (plotOptionsType == null) {
      plotOptionsType = this.options.chart.type;
    }
    if (plotOptionsType == null) {
      plotOptionsType = "series";
    }
    if (plotOptions instanceof PlotOptionsBuilder) {
      plotOptions = plotOptions.options;
    }
    this.options.plotOptions[plotOptionsType] = plotOptions;
    return this;
  }

  series(series: SeriesBuilder | SeriesBuilder[] | any | any[]) {
    if (!Array.isArray(series)) {
      series = [series];
    }
    series.forEach((aSeries) => {
      if (aSeries instanceof SeriesBuilder) {
        aSeries = aSeries.options;
      }
      this.options.series.push(aSeries);
    });
    return this;
  }

  loading(loading: boolean | LoadingBuilder | any = true) {
    if (typeof loading === 'boolean') {
      loading = Chart.loading().enabled(loading);
    }
    if (loading instanceof LoadingBuilder) {
      loading = loading.options;
    }
    if (loading && loading.enabled) {
      this.options.exporting = {enabled: false};
      this.options.lang = {noData: null};
      this.spacing([0, 0, 20, 0]);
    }
    this.options.loading = loading;
    return this;
  }

  colors(colors: string | string[]) {
    if (typeof colors === 'string') {
      colors = [colors];
    }
    this.options.colors = colors;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Allows setting a set of rules to apply for different screen or chart sizes.
   * Each rule specifies additional chart options.
   * @param responsiveRule
   * @returns {ChartBuilder}
   */
  responsive(responsiveRule: ResponsiveRuleBuilder | ResponsiveRuleBuilder[] | any | any[]) {
    if (!Array.isArray(responsiveRule)) {
      responsiveRule = [responsiveRule];
    }
    responsiveRule.forEach(rule => {
      if (rule instanceof ResponsiveRuleBuilder) {
        rule = rule.options;
      }
      this.options.responsive.rules.push(rule);
    });
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Small optimization, saves 1-2 ms each chart
   * @param skipClone
   * @returns {ChartBuilder}
   */
  skipClone(skipClone: boolean = true) {
    this.options.chart.skipClone = skipClone;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Additional CSS styles to apply inline to the container div.
   * Note that since the default font styles are applied in the renderer,
   * it is ignorant of the individual chart options and must be set globally.
   * Defaults to {
   * "fontFamily":"\"Lucida Grande\", \"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif",
   * "fontSize":"12px"
   * }.
   * @param style
   * @returns {ChartBuilder}
   */
  style(style: any) {
    this.options.chart.style = style;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Highchart by default puts a credits label in the lower right corner of the chart.
   * This can be changed using these options.
   * @param credits
   * @returns {ChartBuilder}
   */
  credits(credits: boolean | any = true) {
    if (typeof credits === 'boolean') {
      credits = {
        enabled: credits,
      };
    }
    this.options.credits = credits;
    return this;
  }
}

export type ChartType = "series"|"area"|"arearange"|"areaspline"|"areasplinerange"|"bar"|"boxplot"|"bubble"|"column"|"columnrange"|"errorbar"|"funnel"|"gauge"|"heatmap"|"line"|"pie"|"polygon"|"pyramid"|"scatter"|"solidgauge"|"spline"|"treemap"|"waterfall";

export class AxisBuilder {

  options: any = {
    events: {},
  };

  constructor(title?: string) {
    this.title(title);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Configure a crosshair that follows either the mouse pointer or the hovered point.
   * Set true or null to enable the crosshair; false - to disable. By default, the crosshair is disabled.
   * For a styled crosshair set a configuration object.
   * @param crosshair
   */
  crosshair(crosshair?: any | boolean) {
    if (crosshair == null) {
      crosshair = true;
    }
    this.options.crosshair = crosshair;
    return this;
  }

  allowDecimals(allowDecimals: boolean = true) {
    this.options.allowDecimals = allowDecimals;
    return this;
  }

  ticksDisabled() {
    this.options.tickPositions = [];
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * As opposed to the setExtremes event, this event fires after the final min and max values are computed and
   * corrected for minRange. Fires when the minimum and maximum is set for the axis, either by calling
   * the .setExtremes() method or by selecting an area in the chart. One parameter, event, is passed to the function.
   * This contains common event information based on jQuery or MooTools depending on which library is used as
   * the base for Highcharts. The new user set minimum and maximum values can be found by event.min and event.max.
   * These reflect the axis minimum and maximum in axis values.
   * The actual data extremes are found in event.dataMin and event.dataMax. The this keyword refers to the Axis object.
   * @param afterSetExtremes
   * @returns {AxisBuilder}
   */
  afterSetExtremes(afterSetExtremes: Function) {
    this.options.events.afterSetExtremes = afterSetExtremes;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Fires when the minimum and maximum is set for the axis, either by calling the .setExtremes() method or
   * by selecting an area in the chart. One parameter, event, is passed to the function.
   * This contains common event information based on jQuery or MooTools depending on which library is used as
   * the base for Highcharts. The new user set minimum and maximum values can be found by event.min and event.max.
   * These reflect the axis minimum and maximum in data values.
   * When an axis is zoomed all the way out from the "Reset zoom" button, event.min and event.max are null,
   * and the new extremes are set based on this.dataMin and this.dataMax. The this keyword refers to the Axis object.
   * @param setExtremes
   * @returns {AxisBuilder}
   */
  setExtremes(setExtremes: Function) {
    this.options.events.setExtremes = setExtremes;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If categories are present for the xAxis, names are used instead of numbers for that axis. Since Highcharts 3.0,
   * categories can also be extracted by giving each point a name and setting axis type to category. However,
   * if you have multiple series, best practice remains defining the categories array.
   * Defaults to null.
   * @param categories
   */
  categories(categories: string[]) {
    this.options.categories = categories;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether axis, including axis title, line, ticks and labels, should be visible. Defaults to true.
   * @param visible
   * @returns {AxisBuilder}
   */
  visible(visible: boolean = true) {
    this.options.visible = visible;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Index of another axis that this axis is linked to. When an axis is linked to a master axis, it will take the same
   * extremes as the master, but as assigned by min or max or by setExtremes.
   * It can be used to show additional info, or to ease reading the chart by duplicating the scales.
   * @param linkedTo
   * @returns {AxisBuilder}
   */
  linkedTo(linkedTo: number) {
    this.options.linkedTo = linkedTo;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to show the first tick label. Defaults to true.
   * @param showFirstLabel
   * @returns {AxisBuilder}
   */
  showFirstLabel(showFirstLabel: boolean = true) {
    this.options.showFirstLabel = showFirstLabel;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to show the last tick label. Defaults to true on cartesian charts, and false on polar charts.
   * For the xAxis it's always true.
   * @param showLastLabel
   * @returns {AxisBuilder}
   */
  showLastLabel(showLastLabel: boolean = true) {
    this.options.showLastLabel = showLastLabel;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to force the axis to end on a tick. Use this option with the maxPadding option to control the axis end.
   * Defaults to false for xAxis and true for yAxis.
   * @param endOnTick
   * @returns {AxisBuilder}
   */
  endOnTick(endOnTick: boolean = true) {
    this.options.endOnTick = endOnTick;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The maximum value of the axis. If null, the max value is automatically calculated. If the endOnTick option is true,
   * the max value might be rounded up. If a tickAmount is set, the axis may be extended beyond the set max in order
   * to reach the given number of ticks. The same may happen in a chart with multiple axes,
   * determined by chart.alignTicks, where a tickAmount is applied internally.
   * @param max
   */
  max(max: number) {
    this.options.max = max;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The minimum value of the axis. If null the min value is automatically calculated.
   * If the startOnTick option is true, the min value might be rounded down.
   * @param min
   */
  min(min: number) {
    this.options.min = min;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The amount of ticks to draw on the axis.
   * This opens up for aligning the ticks of multiple charts or panes within a chart.
   * This option overrides the tickPixelInterval option.
   * This option only has an effect on linear axes. Datetime, logarithmic or category axes are not affected.
   * @param tickAmount
   * @returns {AxisBuilder}
   */
  tickAmount(tickAmount: number) {
    this.options.tickAmount = tickAmount;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A callback function returning array defining where the ticks are laid out on the axis.
   * This overrides the default behaviour of tickPixelInterval and tickInterval.
   * The automatic tick positions are accessible through this.tickPositions and can be modified by the callback.
   * @param tickPositioner
   * @returns {AxisBuilder}
   */
  tickPositioner(tickPositioner: Function) {
    this.options.tickPositioner = tickPositioner;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  zeroTickToCenter() {
    return this.tickPositioner(function () {
      let tickAmount = this.tickAmount % 2 == 0 ? this.tickAmount + 1 : this.tickAmount;
      let oldPositions: number[] = this.tickPositions;
      let max: number = Math.max(oldPositions[oldPositions.length - 1], Math.abs(oldPositions[0]), 2);
      let step = max / (tickAmount / 2 | 0);
      let newPositions: number[] = [];
      for (let i = 0; i < tickAmount; ++i) {
        newPositions.push(i * step - max);
      }
      return newPositions;
    })
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The highest allowed value for automatically computed axis extremes.
   * @param ceiling
   * @returns {AxisBuilder}
   */
  ceiling(ceiling: number) {
    this.options.ceiling = ceiling;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The lowest allowed value for automatically computed axis extremes. Defaults to null.
   * @param floor
   * @returns {AxisBuilder}
   */
  floor(floor: number) {
    this.options.floor = floor;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Padding of the min value relative to the length of the axis. A padding of 0.05 will make a 100px axis 5px longer.
   * This is useful when you don't want the lowest data value to appear on the edge of the plot area.
   * When the axis' min option is set or a min extreme is set using axis.setExtremes(), the minPadding will be ignored.
   * Defaults to 0.01.
   * @param minPadding
   * @returns {AxisBuilder}
   */
  minPadding(minPadding: number) {
    this.options.minPadding = minPadding;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Padding of the max value relative to the length of the axis. A padding of 0.05 will make a 100px axis 5px longer.
   * This is useful when you don't want the highest data value to appear on the edge of the plot area.
   * When the axis' max option is set or a max extreme is set using axis.setExtremes(), the maxPadding will be ignored.
   * Defaults to 0.01.
   * @param maxPadding
   * @returns {AxisBuilder}
   */
  maxPadding(maxPadding: number) {
    this.options.maxPadding = maxPadding;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The width of the line marking the axis itself. Defaults to 1 for xAxis, 0 for YAxis.
   * Set null or 0 to disable the axis line.
   * @param lineWidth
   */
  lineWidth(lineWidth: number) {
    this.options.lineWidth = lineWidth;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The distance in pixels from the plot area to the axis line.
   * A positive offset moves the axis with it's line, labels and ticks away from the plot area.
   * This is typically used when two or more axes are displayed on the same side of the plot.
   * With multiple axes the offset is dynamically adjusted to avoid collision,
   * this can be overridden by setting offset explicitly. Defaults to 0.
   * @param offset
   * @returns {AxisBuilder}
   */
  offset(offset: number) {
    this.options.offset = offset;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The axis title, showing next to the axis line. By default 'Values' for yAxis, disabled for xAxis.
   * @param title
   */
  title(title?: string | TitleBuilder | any) {
    if (typeof title === 'string') {
      title = {text: title};
    } else if (title instanceof TitleBuilder) {
      title = title.options;
    }
    this.options.title = title;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The axis labels show the number or category for each tick.
   * @param labels
   */
  labels(labels: boolean | LabelsBuilder | any) {
    if (typeof labels === 'boolean') {
      labels = {enabled: labels};
    }
    if (labels instanceof LabelsBuilder) {
      labels = labels.options;
    }
    this.options.labels = labels;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to display the axis on the opposite side of the normal. The normal is on the left side
   * for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively.
   * This is typically used with dual or multiple axes. Defaults to false.
   * Use opposite() without any parameters to set opposite true.
   *
   * @param opposite
   */
  opposite(opposite: boolean = true) {
    this.options.opposite = opposite;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  lineOpposite() {
    return this.opposite()
      .labels(false)
      .ticksDisabled()
      .offset(-1);
  }
}

export class TitleBuilder {

  options: any = {
    style: {},
  };

  constructor(text?: string) {
    this.text(text);
  }

  style(style: any) {
    this.options.style = style;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * To disable the title, set the text to null. By default it's disabled.
   * @param text
   */
  text(text?: string) {
    this.options.text = text;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The distance between the title and the titled area.
   * Defaults 15 for a chart title, 40 for an axis title.
   * @param margin
   */
  margin(margin: number) {
    this.options.margin = margin;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The color of the title.
   * @param color
   * @returns {TitleBuilder}
   */
  color(color: string) {
    this.options.style.color = color;
    return this;
  }
}

export class LabelsBuilder {

  options: any = {
    style: {},
  };

  // noinspection JSUnusedGlobalSymbols
  /**
   * Callback JavaScript function to format the label. The value is given by this.value.
   * Additional properties for this are axis, chart, isFirst and isLast. The value of the default label formatter
   * can be retrieved by calling this.axis.defaultLabelFormatter.call(this) within the function.
   * @param formatter
   */
  formatter(formatter: Function) {
    this.options.formatter = formatter;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enable or disable the axis labels. Defaults to true.
   * @param enabled
   * @returns {LabelsBuilder}
   */
  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * For horizontal axes, the allowed degrees of label rotation to prevent overlapping labels.
   * If there is enough space, labels are not rotated. As the chart gets narrower, it will start rotating
   * the labels -45 degrees, then remove every second label and try again with rotations 0 and -45 etc.
   * Set it to false to disable rotation, which will cause the labels to word-wrap if possible. Defaults to [-45].
   * @param autoRotation
   * @returns {AxisBuilder}
   */
  autoRotation(autoRotation: boolean | number[]) {
    this.options.autoRotation = autoRotation;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Makes labels positive by removing '-' at the start of labels.
   */
  positive() {
    return this.formatter(function () {
      let defaultLabel: string = this.axis.defaultLabelFormatter.call(this);
      if (defaultLabel.charAt(0) == '-') {
        return defaultLabel.substring(1, defaultLabel.length);
      }
      return defaultLabel;
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Label's color.
   * @param color
   * @returns {LabelsBuilder}
   */
  color(color: string) {
    this.options.style.color = color;
    return this;
  }
}

export class ExportingBuilder {

  options: any = {
    buttons: {},
  };

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to enable the exporting module. Disabling the module will hide the context button,
   * but API methods will still be available. Defaults to true.
   * @param enabled
   */
  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Experimental setting to allow HTML inside the chart (added through the useHTML options),
   * directly in the exported image. This allows you to preserve complicated HTML structures like tables or
   * bi-directional text in exported charts.
   * Disclaimer: The HTML is rendered in a foreignObject tag in the generated SVG.
   * The official export server is based on PhantomJS, which supports this, but other SVG clients,
   * like Batik, does not support it. This also applies to downloaded SVG that you want to open in a desktop client.
   * Defaults to false.
   */
  allowHTML(allowHTML: boolean = true) {
    this.options.allowHTML = allowHTML;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Options for the export button.
   * @param contextButton
   * @returns {ExportingBuilder}
   */
  contextButton(contextButton: ButtonBuilder | any) {
    if (contextButton instanceof ButtonBuilder) {
      contextButton = contextButton.options;
    }
    this.options.buttons.contextButton = contextButton;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether or not to fall back to the export server if the offline-exporting module is unable to export the chart
   * on the client side. Defaults to true.
   */
  fallbackToExportServer(fallbackToExportServer: boolean = true) {
    this.options.fallbackToExportServer = fallbackToExportServer;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * An object containing additional attributes for the POST form that sends the SVG to the export server.
   * For example, a target can be set to make sure the generated image is received in another frame,
   * or a custom enctype or encoding can be set.
   * @param formAttributes
   * @returns {ExportingBuilder}
   */
  formAttributes(formAttributes: any) {
    this.options.formAttributes = formAttributes;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The filename, without extension, to use for the exported chart. Defaults to 'chart'.
   * @param filename
   */
  filename(filename: string) {
    this.options.filename = filename;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The width and height of the original chart when exported, unless an explicit chart.width is set.
   * The width and height exported raster image is then multiplied by scale.
   * @param width
   * @param height
   */
  size(width?: number, height?: number) {
    this.options.sourceWidth = width;
    this.options.sourceHeight = height;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines the scale or zoom factor for the exported image compared to the on-screen display.
   * While for instance a 600px wide chart may look good on a website, it will look bad in print.
   * The default scale of 2 makes this chart export to a 1200px PNG or JPG. Defaults to 2.
   * @param scale
   */
  scale(scale: number) {
    this.options.scale = scale;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Additional chart options to be merged into an exported chart. For example, a common use case is to add data labels
   * to improve readaility of the exported chart, or to add a printer-friendly color scheme. Defaults to null.
   * @param chartOptions
   */
  chartOptions(chartOptions: ChartBuilder | any) {
    if (chartOptions instanceof ChartBuilder) {
      chartOptions = chartOptions.options;
    }
    this.options.chartOptions = chartOptions;
    return this;
  }
}

export class LegendBuilder {

  options: any = {};

  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to reverse the order of the legend items compared to the order of the series or points as defined
   * in the configuration object. Defaults to false.
   * @param reversed
   * @returns {LegendBuilder}
   */
  reversed(reversed: boolean = true) {
    this.options.reversed = reversed;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If the plot area sized is calculated automatically and the legend is not floating, the legend margin is the space
   * between the legend and the axis labels or plot area. Defaults to 12.
   * @param margin
   */
  margin(margin: number) {
    this.options.margin = margin;
    return this;
  }
}

export class PlotOptionsBuilder {

  options: any = {};
  type: ChartType = null;

  constructor(type?: ChartType) {
    this.type = type;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A configuration object for the tooltip rendering of each single series.
   * Properties are inherited from tooltip, but not all tooltip properties can be defined on a plot options level.
   * The full list of tooltip options can be used on a chart level.
   * @param tooltip
   */
  tooltip(tooltip: TooltipBuilder | any) {
    if (tooltip instanceof TooltipBuilder) {
      tooltip = tooltip.options;
    }
    this.options.tooltip = tooltip;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The series type. Defaults to "series".
   * @param type
   */
  seriesType(type: ChartType) {
    this.type = type;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enable or disable the initial animation when a series is displayed.
   * The animation can also be set as a configuration object.
   * Please note that this option only applies to the initial animation of the series itself.
   * For other animations, see chart.animation and the animation parameter under the API methods.
   * The following properties are supported:
   * duration - The duration of the animation in milliseconds.
   * easing - A string reference to an easing function set on the Math object. See the easing demo.
   * Due to poor performance, animation is disabled in old IE browsers for column charts and polar charts.
   * Defaults to true.
   * @param animation
   * @returns {PlotOptionsBuilder}
   */
  animation(animation: boolean | any = true) {
    this.options.animation = animation;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Allow this series' points to be selected by clicking on the markers, bars or pie slices. Defaults to false.
   * @param allowPointSelect
   * @returns {PieOptionsBuilder}
   */
  allowPointSelect(allowPointSelect: boolean = true) {
    this.options.allowPointSelect = allowPointSelect;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to use the Y extremes of the total chart width or only the zoomed area when zooming in on parts of
   * the X axis. By default, the Y axis adjusts to the min and max of the visible data. Cartesian series only.
   * Defaults to false.
   * @param getExtremesFromAll
   * @returns {PlotOptionsBuilder}
   */
  getExtremesFromAll(getExtremesFromAll: boolean = true) {
    this.options.getExtremesFromAll = getExtremesFromAll;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Options for the series data labels, appearing next to each data point.
   * @param dataLabels
   * @returns {PlotOptionsBuilder}
   */
  dataLabels(dataLabels?: boolean | DataLabelsBuilder | any) {
    if (dataLabels == null) {
      dataLabels = true;
    }
    if (typeof dataLabels === 'boolean') {
      dataLabels = {enabled: dataLabels};
    } else if (dataLabels instanceof DataLabelsBuilder) {
      dataLabels = dataLabels.options;
    }
    this.options.dataLabels = dataLabels;
    return this;
  }
}

export class SeriesBuilder extends PlotOptionsBuilder {

  constructor(type?: ChartType) {
    super();
    this.seriesType(type);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The name of the series as shown in the legend, tooltip etc.
   * @param name
   */
  name(name: string) {
    this.options.name = name;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The main color or the series. In line type series it applies to the line and the point markers unless
   * otherwise specified. In bar type series it applies to the bars unless a color is specified per point.
   * The default value is pulled from the options.colors array.
   * @param color
   */
  color(color: string) {
    this.options.color = color;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The series type. Defaults to "line".
   * @param type
   */
  seriesType(type: ChartType) {
    super.seriesType(type);
    this.options.type = type;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * When using dual or multiple y axes, this number defines which yAxis the particular series is connected to.
   * It refers to either the axis id or the index of the axis in the yAxis array, with 0 being the first. Defaults to 0.
   * @param yAxis
   */
  yAxis(yAxis: number) {
    this.options.yAxis = yAxis;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * You can set the cursor to "pointer" if you have click events attached to the series, to signal to the user
   * that the points and lines can be clicked. Defaults to undefined.
   * @param {string} cursor
   * @returns {this}
   */
  cursor(cursor: string) {
    this.options.cursor = cursor;
    return this;
  }

  cursorPointer() {
    return this.cursor('pointer');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Fires when the series is clicked. One parameter, event, is passed to the function, containing
   * common event information. Additionally, event.point holds a pointer to the nearest point on the graph.
   * Defaults to undefined.
   * @param {Function} func
   * @returns {this}
   */
  onClick(func: Function) {
    if (!this.options.events) {
      this.options.events = {};
    }
    this.options.events.click = func;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * An array of data points for the series.
   * Elements can be of a type number, DataBuilder, custom type, array of numbers and etc.
   * @param data
   */
  data(data: any[]) {
    if (data != null) {
      data.forEach((value, index) => {
        if (value instanceof DataBuilder) {
          data[index] = value.options;
        }
      });
    }
    this.options.data = data;
    return this;
  }
}

export class HistogramOptionsBuilder extends SeriesBuilder {

  constructor(type?: ChartType) {
    super(type);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to stack the values of each series on top of each other. Possible values are null to disable,
   * "normal" to stack by value or "percent". When stacking is enabled, data must be sorted in ascending X order.
   * @param stacking
   */
  stacking(stacking: StackingType = "normal") {
    this.options.stacking = stacking;
    return this;
  }
}

export class LineOptionsBuilder extends HistogramOptionsBuilder {

  constructor(name?: string, type: ChartType = "line") {
    super(type);
    this.name(name);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Pixel with of the graph line. Defaults to 2.
   * @param lineWidth
   * @returns {LineOptionsBuilder}
   */
  lineWidth(lineWidth: number) {
    this.options.lineWidth = lineWidth;
    return this;
  }

  marker(marker: MarkerBuilder | any) {
    if (marker instanceof MarkerBuilder) {
      marker = marker.options;
    }
    this.options.marker = marker;
    return this;
  }

  slimLine() {
    return this.lineWidth(1)
      .marker(Chart.marker().radius(1));
  }
}

export class ColumnOptionsBuilder extends HistogramOptionsBuilder {

  constructor(name?: string, type: ChartType = "column") {
    super(type);
    this.name(name);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Padding between each value groups, in x axis units. Defaults to 0.2.
   * @param groupPadding
   * @returns {ColumnOptionsBuilder}
   */
  groupPadding(groupPadding: number) {
    this.options.groupPadding = groupPadding;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * When using automatic point colors pulled from the options.colors collection, this option determines whether
   * the chart should receive one color per series or one color per point. Defaults to false.
   * @param colorByPoint
   * @returns {ColumnOptionsBuilder}
   */
  colorByPoint(colorByPoint: boolean = true) {
    this.options.colorByPoint = colorByPoint;
    return this;
  }
}

export class BarOptionsBuilder extends ColumnOptionsBuilder {

  constructor(name?: string) {
    super(name, "bar");
  }
}

export class AreaOptionsBuilder extends LineOptionsBuilder {

  constructor(name?: string) {
    super(name, "area");
    this.name(name);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Fill color or gradient for the area. When null, the series' color is used with the series' fillOpacity.
   * @param fillColor
   * @returns {AreaOptionsBuilder}
   */
  fillColor(fillColor: string | GradientColorBuilder | any) {
    if (fillColor instanceof GradientColorBuilder) {
      fillColor = fillColor.options;
    }
    this.options.fillColor = fillColor;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Fill opacity for the area. Note that when you set an explicit fillColor, the fillOpacity is not applied.
   * Instead, you should define the opacity in the fillColor with an rgba color definition. Defaults to 0.75.
   * @param fillOpacity
   * @returns {AreaOptionsBuilder}
   */
  fillOpacity(fillOpacity: number) {
    this.options.fillOpacity = fillOpacity;
    return this;
  }
}

export class PieOptionsBuilder extends SeriesBuilder {

  constructor(name?: string) {
    super("pie");
    this.name(name);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The size of the inner diameter for the pie. A size greater than 0 renders a donut chart.
   * Can be a percentage or pixel value. Percentages are relative to the pie size. Pixel values are given as integers.
   * Note: in Highcharts < 4.1.2, the percentage was relative to the plot area, not the pie size.
   * Defaults to 0.
   * @param innerSize
   * @returns {PieOptionsBuilder}
   */
  innerSize(innerSize: number|string) {
    this.options.innerSize = innerSize;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The diameter of the pie relative to the plot area. Can be a percentage or pixel value.
   * Pixel values are given as integers.
   * The default behaviour (as of 3.0) is to scale to the plot area and give room for data labels within the plot area.
   * As a consequence, the size of the pie may vary when points are updated and data labels more around.
   * In that case it is best to set a fixed value, for example "75%". Defaults to .
   * @param size
   * @returns {PieOptionsBuilder}
   */
  size(size: number|string) {
    this.options.size = size;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The center of the pie chart relative to the plot area. Can be percentages or pixel values.
   * The default behaviour (as of 3.0) is to center the pie so that all slices and data labels are within the plot area.
   * As a consequence, the pie may actually jump around in a chart with dynamic values, as the data labels move.
   * In that case, the center should be explicitly set, for example to x = "50%" and y = "50%".
   * Defaults to x = null, y = null.
   * @param x
   * @param y
   * @returns {PieOptionsBuilder}
   */
  center(x?: number|string, y?: number|string) {
    this.options.center = [x, y];
    return this;
  }
}

export type StackingType = "normal" | "percent" | null;

export class DataBuilder {

  options: any = {};

  constructor(y?: number) {
    this.y(y);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The x value of the point. For datetime axes, the X value is the timestamp in milliseconds since 1970.
   * @param x
   */
  x(x: number) {
    this.options.x = x;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The y value of the point.
   * @param y
   */
  y(y: number) {
    this.options.y = y;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The name of the point as shown in the legend, tooltip, dataLabel etc.
   * If the xAxis.type is set to category, and no categories option exists, the category will be pulled from
   * the point.name of the last series defined. For multiple series, best practice however is to define xAxis.categories.
   * @param name
   */
  name(name: string) {
    this.options.name = name;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Individual color for the point. By default the color is pulled from the global colors array. Defaults to undefined.
   * @param color
   */
  color(color: string) {
    this.options.color = color;
    return this;
  }
}

export class TooltipBuilder {

  options: any = {};

  // noinspection JSUnusedGlobalSymbols
  /**
   * A callback function for formatting the HTML output for a single point in the tooltip.
   * Like the pointFormat string, but with more flexibility. The this keyword refers to the Point object.
   * @param pointFormatter
   */
  pointFormatter(pointFormatter: Function) {
    this.options.pointFormatter = pointFormatter;
    return this;
  }

  valueFormatter(valueFormatter: Function | ValueFormatBuilder) {
    let func: Function;
    if (!(valueFormatter instanceof Function)) {
      func = valueFormatter.getFormatter();
    } else {
      func = valueFormatter;
    }
    return this.pointFormatter(function () {
      return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: ${func.call(this)}<br/>`;
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Callback function to format the text of the tooltip.
   * Return false to disable tooltip for a specific point on series. A subset of HTML is supported.
   * The HTML of the tooltip is parsed and converted to SVG, therefore this isn't a complete HTML renderer.
   * The following tags are supported: &lt;b&gt;, &lt;strong&gt;, &lt;i&gt;, &lt;em&gt;, &lt;br/&gt;, &lt;span&gt;.
   * Spans can be styled with a style attribute, but only text-related CSS that is shared with SVG is handled.
   * Since version 2.1 the tooltip can be shared between multiple series through the shared option.
   * The available data in the formatter differ a bit depending on whether the tooltip is shared or not.
   * In a shared tooltip, all properties except x, which is common for all points, are kept in an array, this.points.
   *
   * Available data are:
   *
   * * this.percentage (not shared) / this.points[i].percentage (shared) -
   * Stacked series and pies only. The point's percentage of the total.
   * * this.point (not shared) / this.points[i].point (shared) -
   * The point object. The point name, if defined, is available through this.point.name.
   * * this.points - In a shared tooltip, this is an array containing all other properties for each point.
   * * this.series (not shared) / this.points[i].series (shared) -
   * The series object. The series name is available through this.series.name.
   * * this.total (not shared) / this.points[i].total (shared) -
   * Stacked series only. The total value at this point's x value.
   * * this.x - The x value. This property is the same regardless of the tooltip being shared or not.
   * * this.y (not shared) / this.points[i].y (shared) - The y value.
   * @param formatter
   * @returns {TooltipBuilder}
   */
  formatter(formatter: Function) {
    this.options.formatter = formatter;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The HTML of the tooltip header line. Variables are enclosed by curly brackets. Available variables  are point.key,
   * series.name, series.color and other members from the point and series objects. The point.key variable contains
   * the category name, x value or datetime string depending on the type of axis. For datetime axes, the point.key
   * date format can be set using tooltip.xDateFormat.
   * Defaults to '<span style="font-size: 10px">{point.key}</span><br/>'.
   * @param headerFormat
   */
  headerFormat(headerFormat: string) {
    this.options.headerFormat = headerFormat;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets headerFormat: '<span style="font-size: 10px">{point.key} - {series.name}</span><br/>'.
   * @returns {TooltipBuilder}
   */
  headerFormatPointKeyAndSeriesName() {
    return this.headerFormat('<span style="font-size: 10px">{point.key} - {series.name}</span><br/>');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets pointFormat: '<span style="color:{point.color}">\u25CF</span> {value}'.
   * @returns {TooltipBuilder}
   */
  pointFormatValue(valueFormatter?: ValueFormatBuilder) {
    return this.pointFormatter(function () {
      return `<span style="color:${this.color}">\u25CF</span>  ${valueFormatter ? valueFormatter.getFormatter().call(this) : this.y}<br/>`;
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The HTML of the point's line in the tooltip. Variables are enclosed by curly brackets.
   * Available variables are point.x, point.y, series.name and series.color and other properties on the same form.
   * Furthermore, point.y can be extended by the tooltip.valuePrefix and tooltip.valueSuffix variables.
   * This can also be overridden for each series, which makes it a good hook for displaying units.
   * In styled mode, the dot is colored by a class name rather than the point color.
   * Defaults to <span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>.
   * @param pointFormat
   * @returns {TooltipBuilder}
   */
  pointFormat(pointFormat: string) {
    this.options.pointFormat = pointFormat;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Padding inside the tooltip, in pixels. Defaults to 8.
   * @param padding
   * @returns {TooltipBuilder}
   */
  padding(padding: number) {
    this.options.padding = padding;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A callback function to place the tooltip in a default position.
   * The callback receives three parameters: labelWidth, labelHeight and point, where point contains values for
   * plotX and plotY telling where the reference point is in the plot area.
   * Add chart.plotLeft and chart.plotTop to get the full coordinates.
   * The return should be an object containing x and y values, for example { x: 100, y: 100 }.
   * @param positioner
   * @returns {TooltipBuilder}
   */
  positioner(positioner: Function) {
    this.options.positioner = positioner;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  sparkLineTooltip() {
    return this.headerFormatSeriesNameAndPointKey()
      .hideDelay(0)
      .padding(3)
      .positioner(function (labelWidth, labelHeight, point) {
        let x = point.plotX + 9;
        if (x + labelWidth - 2 > this.chart.plotWidth) {
          x = point.plotX - labelWidth - 9;
        }
        let y = point.plotY - labelHeight / 2;
        if (y + labelHeight - 2 > this.chart.plotHeight) {
          y = this.chart.plotHeight - labelHeight + 2;
        }
        return {x: x, y: y};
      });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The number of milliseconds to wait until the tooltip is hidden when mouse out from a point or chart.
   * Defaults to 500.
   * @param hideDelay
   * @returns {TooltipBuilder}
   */
  hideDelay(hideDelay: number) {
    this.options.hideDelay = hideDelay;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets headerFormat: '<span style="font-size: 10px">{series.name} - {point.key}</span><br/>'
   * @returns {TooltipBuilder}
   */
  headerFormatSeriesNameAndPointKey() {
    return this.headerFormat('<span style="font-size: 10px">{series.name} - {point.key}</span><br/>');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * When the tooltip is shared, the entire plot area will capture mouse movement or touch events.
   * Tooltip texts for series types with ordered data (not pie, scatter, flags etc) will be shown in a single bubble.
   * This is recommended for single series charts and for tablet/mobile optimized charts. See also tooltip.split,
   * that is better suited for charts with many series, especially line-type series. Defaults to false.
   * @param shared
   * @returns {TooltipBuilder}
   */
  shared(shared: boolean = true) {
    this.options.shared = shared;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Split the tooltip into one label per series, with the header close to the axis.
   * This is recommended over shared tooltips for charts with multiple line series,
   * generally making them easier to read. Defaults to false.
   * @param split
   * @returns {TooltipBuilder}
   */
  split(split: boolean = true) {
    this.options.split = split;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A string to append to each series' y value. Overridable in each series' tooltip options object.
   * @param valueSuffix
   * @returns {TooltipBuilder}
   */
  valueSuffix(valueSuffix: string) {
    this.options.valueSuffix = valueSuffix;
    return this;
  }
}

export class DataLabelsBuilder {

  options: any = {};

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to allow data labels to overlap. To make the labels less sensitive for overlapping,
   * the dataLabels.padding can be set to 0. Defaults to false.
   * @param allowOverlap
   * @returns {DataLabelsBuilder}
   */
  allowOverlap(allowOverlap: boolean = true) {
    this.options.allowOverlap = allowOverlap;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enable or disable the data labels. Defaults to false.
   * @param enabled
   * @returns {DataLabelsBuilder}
   */
  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * When either the borderWidth or the backgroundColor is set, this	is the padding within the box. Defaults to 5.
   * @param padding
   * @returns {DataLabelsBuilder}
   */
  padding(padding: number) {
    this.options.padding = padding;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The distance of the data label from the pie's edge. Negative numbers put the data label on top of the pie slices.
   * Connectors are only shown for data labels outside the pie. Defaults to 30.
   * @param distance
   * @returns {DataLabelsBuilder}
   */
  distance(distance: number) {
    this.options.distance = distance;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The y position offset of the label relative to the point. Defaults to -6.
   * @param y
   */
  y(y: number) {
    this.options.y = y;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Callback JavaScript function to format the data label. Note that if a format is defined, the format takes
   * precedence and the formatter is ignored. Available data are:
   * this.percentage: Stacked series and pies only. The point's percentage of the total.
   * this.point: The point object. The point name, if defined, is available through this.point.name.
   * this.series: The series object. The series name is available through this.series.name.
   * this.total: Stacked series only. The total value at this point's x value.
   * this.x: The x value.
   * this.y: The y value.
   * @param formatter
   * @returns {DataLabelsBuilder}
   */
  formatter(formatter: Function) {
    this.format(null);
    this.options.formatter = formatter;
    return this;
  }

  precision(precision: number) {
    return this.formatter(function () {
      return NumberPipe.transform(this.y, precision);
    })
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A format string for the data label. Available variables are the same as for formatter. Defaults to {y}.
   * @param format
   * @returns {DataLabelsBuilder}
   */
  format(format: string) {
    this.options.format = format;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Styles for the label.
   * Defaults to {"color": "contrast", "fontSize": "11px", "fontWeight": "bold", "textOutline": "1px 1px contrast" }.
   * @param style
   * @returns {DataLabelsBuilder}
   */
  style(style: any) {
    this.options.style = style;
    return this;
  }
}

export class ValueFormatBuilder {

  options: any = {};

  abs(abs: boolean = true) {
    this.options.abs = abs;
    return this;
  }

  sign(sign: boolean = true) {
    this.options.sign = sign;
    return this;
  }

  precision(precision: number) {
    this.options.precision = precision;
    return this;
  }

  suffix(suffix: string) {
    this.options.suffix = suffix;
    return this;
  }

  getFormatter() {
    let _this = this;
    return function () {
      let formattedValue = this.y;
      if (_this.options.abs) {
        formattedValue = Math.abs(formattedValue);
      }
      formattedValue = NumberPipe.transform(formattedValue, _this.options.precision, _this.options.sign);
      formattedValue = `<b>${formattedValue}</b>` + (_this.options.suffix ? ' ' + _this.options.suffix : '');
      return formattedValue;
    }
  }
}

export class MarkerBuilder {

  options: any = {};

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enable or disable the point marker. If null, the markers are hidden when the data is dense,
   * and shown for more widespread data points. Defaults to null.
   * @param enabled
   * @returns {MarkerBuilder}
   */
  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The radius of the point marker. Defaults to 4.
   * @param radius
   * @returns {MarkerBuilder}
   */
  radius(radius: number) {
    this.options.radius = radius;
    return this;
  }
}

export class GradientColorBuilder {

  options: any = {};

  linearGradient(x1: number, y1: number, x2: number, y2: number) {
    this.options.linearGradient = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    };
    return this;
  }

  stops(stops: any) {
    this.options.stops = stops;
    return this;
  }

  fromTopToBottom() {
    return this.linearGradient(0, 0, 0, 1);
  }

  descendingAlpha(color: any) {
    return this.stops([
      [0, color.toString()],
      [1, color.setAlpha(0).toString()]
    ])
  }

  // noinspection JSUnusedGlobalSymbols
  fromTopToBottomDescendingAlpha(color: any) {
    return this.fromTopToBottom().descendingAlpha(color);
  }
}

export class ResponsiveRuleBuilder {

  options: any = {
    condition: {},
  };

  // noinspection JSUnusedGlobalSymbols
  /**
   * The responsive rule applies if the chart height is less than this.
   * @param maxHeight
   * @returns {ResponsiveRuleBuilder}
   */
  maxHeight(maxHeight: number) {
    this.options.condition.maxHeight = maxHeight;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The responsive rule applies if the chart height is greater than this. Defaults to 0.
   * @param minHeight
   * @returns {ResponsiveRuleBuilder}
   */
  minHeight(minHeight: number) {
    this.options.condition.minHeight = minHeight;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The responsive rule applies if the chart width is less than this.
   * @param maxWidth
   * @returns {ResponsiveRuleBuilder}
   */
  maxWidth(maxWidth: number) {
    this.options.condition.maxWidth = maxWidth;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The responsive rule applies if the chart width is greater than this. Defaults to 0.
   * @param minWidth
   * @returns {ResponsiveRuleBuilder}
   */
  minWidth(minWidth: number) {
    this.options.condition.minWidth = minWidth;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A full set of chart options to apply as overrides to the general chart options.
   * The chart options are applied when the given rule is active.
   * A special case is configuration objects that take arrays, for example xAxis, yAxis or series.
   * For these collections, an id option is used to map the new option set to an existing object.
   * If an existing object of the same id is not found, the item of the same index updated.
   * So for example, setting chartOptions with two series items without an id,
   * will cause the existing chart's two series to be updated with respective options.
   * @param chartOptions
   * @returns {ResponsiveRuleBuilder}
   */
  chartOptions(chartOptions: ChartBuilder | any) {
    if (chartOptions instanceof ChartBuilder) {
      chartOptions = chartOptions.options;
    }
    this.options.chartOptions = chartOptions;
    return this;
  }
}

export class ButtonBuilder {

  options: any = {};

  // noinspection JSUnusedGlobalSymbols
  /**
   * A configuration object for the button theme. The object accepts SVG properties like stroke-width, stroke and fill.
   * Tri-state button styles are supported by the states.hover and states.select objects.
   * @param theme
   * @returns {ButtonBuilder}
   */
  theme(theme: any) {
    this.options.theme = theme;
    return this;
  }

    // noinspection JSUnusedGlobalSymbols
  /**
     * A collection of strings pointing to config options for the menu items.
     * The config options are defined in the menuItemDefinitions option.
     * By default, there is the "Print" menu item plus one menu item for each of the available export types.
     * @param {string[]} menuItems
     * @returns {this}
     */
  menuItems(menuItems: string[]) {
    this.options.menuItems = menuItems;
    return this;
  }
}

export class LoadingBuilder {

  options: any = {};

  enabled(enabled: boolean = true) {
    this.options.enabled = enabled;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * CSS styles for the loading label span. Defaults to { "fontWeight": "bold", "position": "relative", "top": "45%" }.
   * @param style
   * @returns {LoadingBuilder}
   */
  style(style: any) {
    this.options.style = style;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * CSS styles for the loading label span. Defaults to { "fontWeight": "bold", "position": "relative", "top": "45%" }.
   * @param labelStyle
   */
  labelStyle(labelStyle: any) {
    this.options.labelStyle = labelStyle;
    return this;
  }
}
