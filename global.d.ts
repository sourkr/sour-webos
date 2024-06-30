type Common = 'none' | 'initital' | 'inherit'
type CSSProperty<T extends string> = T | `${T} !important`

type Operations = '+' | '-' | '*' | '/' 

type DimesionUnits = `px` | '%' | 'cm' | 'in' | 'rem' | 'em' | ''
type Calc = `calc(${Dimesion} ${Operations} ${Dimesion})`
type Dimension = `${number}${DimesionUnits}` // | Calc

type Color = 'red' | 'green' | 'blue'

interface CSSStyle {
  position: CSSProperty<'absolute' | 'relative' | 'static' | 'fixed'>
  
  top: CSSProperty<Dimension>
  left: CSSProperty<Dimension>
  bottom: CSSProperty<Dimension>
  right: CSSProperty<Dimension>
  
  width: CSSProperty<Dimension>
  height: CSSProperty<Dimension>
  
  background: CSSProperty<Color>
}

function css(obj: CSSStyle): string