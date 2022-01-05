export class Utils {

  /**
   * https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
   */
  static merge(target: any, source: any) {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) Object.assign(source[key], this.merge(target[key], source[key]))
    }
  
    // Join `target` and modified `source`
    Object.assign(target || {}, source)
    return target
  }

}