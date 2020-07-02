/**
 * 方便的错误捕获
 * @param{Promise} promise
 */

export default async function to(promise) {
  try {
        const data = await promise;
        return [null, data];
    }
    catch (err) {
        return [err, null];
    }
}
