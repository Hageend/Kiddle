import "./Carrito.css";

function Productos({ product, onAddToCart }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="card-image" />
      <h3 className="card-title">{product.name}</h3>
      <p className="card-price">${product.price}</p>
      <button className="card-button" onClick={() => onAddToCart(product)}>
        Agregar al carrito
      </button>
    </div>
  );
}

export default Productos;
