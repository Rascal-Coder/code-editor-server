type rawType = 'Object' | 'Array' | 'Number' | 'String';

export function isType(...args: rawType[]) {
  return (o: unknown) => {
    return args.some(
      (t) => Object.prototype.toString.call(o) === `[object ${t}]`,
    );
  };
}

export function formatDockerOutput(outputString: string): string {
  if (outputString.length > 8200) {
    outputString =
      outputString.slice(0, 4000) +
      outputString.slice(outputString.length - 4000);
  }

  if (isType('Object', 'Array')(outputString)) {
    outputString = JSON.stringify(outputString);
  }

  if (typeof outputString !== 'string') {
    outputString = String(outputString);
  }

  let outputStringArr = outputString.split('%0A');

  if (outputStringArr.length > 200) {
    outputStringArr = outputStringArr
      .slice(0, 100)
      .concat(
        ['%0A', '...' + encodeURI('数据太多,已折叠'), '%0A'],
        outputStringArr.slice(outputStringArr.length - 100),
      );
  }

  return outputStringArr.join('%0A');
}
