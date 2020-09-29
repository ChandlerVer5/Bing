# cerebro-ui

> It is UI components library for [Cerebro app](http://www.cerebroapp.com) plugins

## Components

This package contains main UI elements that you need to use in your plugin previews:

### Keyboard navigation lists

This component used to build lists with keyboard navigation:

- Arrows and <kbd>ctrl+j/k</kbd> used to select next or previous term;
- <kbd>enter</kbd> or <kbd>o</kbd> used to select term;
- <kbd>←</kbd> and <kbd>esc</kbd> used to move selection back to main results list;

```
import { KeyboardNav, KeyboardNavItem } from 'cerebro-ui'

const Preview = ({ items, onSelect }) => (
  <KeyboardNav>
    <ul className={styles.list}>
    {
      items.map(s => (
        <KeyboardNavItem key={s} onSelect={() => onSelect(term)}>
          {term}
        </KeyboardNavItem>
      ))
    }
    </ul>
  </KeyboardNav>
)

```

### Loading

For consistence, it is recommended to use one loading spinner component in all plugins:

```
import { Loading } from 'cerebro-ui'

const Preview = ({ isLoading }) => (
  isLoading ? <Loading /> : <MyPluginPreview />
)

```

### Preload

In most cases `<Loading />` component is displayed until some promise resolved/rejected. In this case to simplify component code and remove unnecessary `state` with loading/loaded flags, `<Preload />` component could be used:

```
import { Preload, Loading } from 'cerebro-ui'

const Preview = (promise) => (
  <Preload promise={promise} loader=>{Loading}>
    { (promiseResult) => <YourComponent someProp={promiseResult} /> }
  </Preload>
)

```

### Form elements

```
import { Button, Checkbox, Select, Text } from 'cerebro-ui/Form'
```

## Related

- [Cerebro](http://github.com/KELiON/cerebro) – main repo for Cerebro app;
- [cerebro-tools](http://github.com/KELiON/cerebro-tools) – package with tools to simplify package creation;
- [cerebro-plugin](http://github.com/KELiON/cerebro-tools) – boilerplate to create cerebro plugins;

## License

MIT © [Alexandr Subbotin](http://asubbotin.ru)
