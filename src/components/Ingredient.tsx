import { ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import DeleteIcon from '@mui/icons-material/Delete'
import { IngredientModel } from '../models'

interface Props {
  Ingredient: IngredientModel
  emitUpdateIngredient: (ingredient: IngredientModel) => void
  emitDeleteIngredient: (ingredientId: number) => void
}

const Ingredient = (props: Props) => {
  const updateName = (evt: any) => {
    props.emitUpdateIngredient({ ...props.Ingredient, Name: evt.target.value })
  }
  const updateAmount = (evt: any) => {
    props.emitUpdateIngredient({
      ...props.Ingredient,
      Amount: evt.target.value,
    })
  }
  const updateUnitType = (evt: any) => {
    props.emitUpdateIngredient({
      ...props.Ingredient,
      UnitType: evt.target.value,
    })
  }

  return (
    <ListItem key={props.Ingredient.Id}>
      <div className="MuiListItem-root__text">
        <ContentEditable html={props.Ingredient.Name || 'Name'} onChange={updateName} />
        <ContentEditable
          html={props.Ingredient.Amount.toString() || 'Amount'}
          onChange={updateAmount}
        />
        <ContentEditable html={props.Ingredient.UnitType || 'UnitType'} onChange={updateUnitType} />
      </div>
      {/* <ListItemText
        // sx={{ width: `${inputWidth}px` }}
        primary={<ContentEditable html={props.Ingredient.Name} onChange={updateName} />}
      />
      <ListItemText
        sx={{ width: '' }}
        primary={
          <ContentEditable html={props.Ingredient.Amount.toString()} onChange={updateAmount} />
        }
      />
      <ListItemText
        sx={{ width: '' }}
        primary={<ContentEditable html={props.Ingredient.UnitType} onChange={updateUnitType} />}
      /> */}
      <ListItemButton
        sx={{ ml: 'auto' }}
        onClick={() => props.emitDeleteIngredient(props.Ingredient.Id!)}
      >
        <ListItemIcon sx={{ ml: 'auto' }}>
          <DeleteIcon />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}

export default Ingredient
