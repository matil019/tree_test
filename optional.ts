

export default class Optional<S, A> {
  get: (s: S) => A | null;
  replace: (b: A, s: S) => S;

  constructor(_get: (s: S) => A | null, _set: (b: A, s: S) => S) {
    this.get = _get;
    this.replace = _set;
  }

  compose<C>(that: Optional<A,C>): Optional<S,C> {
    return new Optional<S,C>(
      s => { const a = this.get(s); return (a == null) ? null : that.get(a); },
      (c, s) => { const a = this.get(s); return (a == null) ? s : this.replace(that.replace(c, a), s); },
    );
  }

  modify(f: (a: A) => A, s: S): S {
    const a = this.get(s);
    if (a == null) {
      return s;
    } else {
      return this.replace(f(a), s);
    }
  }

  static empty<S,A>(): Optional<S,A> {
    return new Optional<S,A>(_ => null, (_, s) => s);
  }
};

