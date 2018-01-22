/**
 *
 */
class ResponseMMP {
  /**
   * Create new object of ResponseMMP
   */
  constructor() {
    this.ok = true;
    this.error = {
      code: 0,
      message: '',
    };
    this.data = {};
  }

  /**
   * Generate a response to an api request
   * @param {*} data
   * @return {ResponseMMP}
   */
  response(data) {
    this.data = data;
    return this;
  }

  /**
   * Generate a respnse to an api request with an error
   * @param {*} error
   * @param {*} data
   * @return {ResponseMMP}
   */
  responseError(error, data) {
    this.ok = false;
    this.error = error;
    this.data = data;
    return this;
  }
}

module.exports = ResponseMMP;
