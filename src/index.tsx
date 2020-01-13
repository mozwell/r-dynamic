import * as React from 'react'

export type WrapperElType = string | React.FunctionComponent<any> | React.ComponentClass<any, any> | React.ExoticComponent<any> | null | undefined

export type DynamicComponentProps = {
  $as?: WrapperElType
  $if?: boolean
  $for?: Array<any> | object | number
  $for_if?: (item?: any, index?: number | string) => boolean
  $for_key?: (item: any) => any
  $for_render?: (item?: any, index?: number | string) => React.ReactChild
  children?: React.ReactChild
} & {
  [key: string]: any
}

/** Private Method：to judge whether a component is exotic */
const isExoticComponent = (x: WrapperElType): x is React.ExoticComponent<any> => {
  return (x as React.ExoticComponent<any>).$$typeof !== undefined
}

/** Private Method：to judge whether a function is a class component */
const isClassComponent = (fn: Function): fn is React.ComponentClass<any, any> => {
  return !!(fn.prototype && fn.prototype.isReactComponent)
}

/** Private Method：to judge whether a specific variable is an instance of number */
const isNum = (x: any): x is number => {
  return typeof x === 'number'
}

const DynamicComponent: React.SFC<DynamicComponentProps> = (props) => {
  const {
    $as: WrapperEl,
    $if = true,
    $for,
    $for_if = () => true,
    $for_key,
    $for_render,
    children,
    ...otherProps
  } = props

  if (!$if) {
    return null
  }

  const render = (WrapperEl: WrapperElType, otherProps: object, children?: React.ReactChild) => {
    if (WrapperEl === '' || WrapperEl === undefined || WrapperEl === null) {
      return <React.Fragment>{children}</React.Fragment>

    } else if (typeof WrapperEl === 'string') {
      return React.createElement(WrapperEl!, otherProps, children)

    } else if (isExoticComponent(WrapperEl)) {
      return <WrapperEl {...otherProps}>{children}</WrapperEl>

    } else if (typeof WrapperEl === 'function') {
      if (!isClassComponent(WrapperEl)) {
        let result = WrapperEl(
          {children, ...otherProps}
        )
        if (result === undefined) {
          return <React.Fragment>{children}</React.Fragment>
        }
      }
      return <WrapperEl {...otherProps}>{children}</WrapperEl>

    } else {
      return <React.Fragment>{children}</React.Fragment>
    }
  }

  if ($for !== undefined) {
    const isArr = Array.isArray($for)
    let _$for: Array<any> | object

    if (isNum($for)) {
      const positiveInt = $for > 0 ? Math.floor($for) : -Math.floor($for)
      _$for = new Array(positiveInt).fill(undefined)
    } else {
      _$for = $for
    }

    const shownArr =
      (Object
        .keys(_$for) as Array<keyof typeof _$for>)
        .filter(item => {
          return $for_if(_$for[(item as keyof typeof _$for)], isArr ? +item : item)
        })

    const resultArr =
      shownArr
        .map(item => {
          return (
            $for_render === undefined ?
            children :
            $for_render(_$for[(item as keyof typeof _$for)], isArr ? +item : item)
          )
        })
        .map((item, index) => {
          const key =
            $for_key === undefined || isNum ?
            index :
            $for_key(_$for[shownArr[index]])

          return (
            <React.Fragment key={key}>
              {render(WrapperEl, otherProps, item)}
            </React.Fragment>
          )
        })

    return <React.Fragment>{resultArr}</React.Fragment>
  }

  return render(WrapperEl, otherProps, children)
}

export default DynamicComponent
