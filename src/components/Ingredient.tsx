import { ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import ContentEditable from 'react-contenteditable'
import DeleteIcon from '@mui/icons-material/Delete'
import { IngredientModel } from '../models'

interface Props {
  Ingredient: IngredientModel
  emitUpdateIngredient: (ingredient: IngredientModel) => void
  emitDeleteIngredient: (ingredientId: string) => void
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
        <ContentEditable
          key={`${props.Ingredient.Id}-Name`}
          onChange={updateName}
          html={props.Ingredient.Name}
          className="MuiListItem-root__text__name"
        />
        <ContentEditable
          key={`${props.Ingredient.Id}-Amount`}
          onChange={updateAmount}
          html={props.Ingredient.Amount.toString()}
        />
        <ContentEditable
          key={`${props.Ingredient.Id}-UnitType`}
          onChange={updateUnitType}
          html={props.Ingredient.UnitType}
        />
      </div>
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
