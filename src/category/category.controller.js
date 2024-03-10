import Categoria from '../category/category.model.js';
import Producto from '.././product/product.model.js'
import { response, json } from 'express';



export const categoriaPost = async (req, res) =>{
    const { nameCat, descripcion } = req.body;
    const categoria = new Categoria({nameCat, descripcion});

    await categoria.save();
    res.status(200).json({
        msg: 'La categoria se agrego correctamente',
        categoria
    });
}

export const categoriaGet = async (req, res = response ) => {
    try{
        const { limite, desde } = req.query;
        const query = { estado: true};
    
        const [total, categoria] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);
    
        res.status(200).json({
            total,
            categoria
        });
    }catch(e){
        console.log(e);
        res.status(500).json({msg:'Error interno del servidor'})
    }
} 

export const categoriaPut = async (req, res) => {
    const { id } = req.params;
    const { _id, ...resto} = req.body;

    await Categoria.findByIdAndUpdate(id, resto);

    const cat = await Categoria.findOne({_id: id});
    
    res.status(200).json({
        msg: 'La catergoria fue actualizada correctamente',
        cat
    })


}

export const categoriaDelete = async (req, res) => {
try {
    const { id } = req.params;
    const defaultCat = await Categoria.findOne({ nameCat: 'Default' });
    const defaultId = defaultCat._id;
    const changeCat = await Categoria.findByIdAndUpdate(id,{estado: false});
    if (changeCat.nameCat === 'Default') {
      return res.status(400).json({
        msg: 'You cannot delete the default category',
      });
    } else if (!changeCat) {
      return res.status(400).json({
        msg: 'Category not found',
      });
    }

    await Producto.updateMany(
      { category: id },
      { $set: { category: defaultId } }
    ); 

    const categoria = await Categoria.findOne({ _id: id });

    res.status(200).json({
      msg: 'The category was deleted correctly',
      categoria,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
