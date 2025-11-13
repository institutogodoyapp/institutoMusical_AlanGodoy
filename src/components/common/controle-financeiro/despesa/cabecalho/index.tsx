import CustomButton from "@/components/common/customButton";
import { FaPlus } from "react-icons/fa";

export const CabecalhoDespesas = ({ abrirModalDespesa }: any) => (
  <div className="box" style={{ display: 'inline', boxShadow: 'none' }}>
    <div className="level">
      <div className="level-left">
        <h2 className="title is-5" style={{marginBottom: '20px'}}>Despesas</h2>
      </div>
      <div className="level-right">
        <div className="buttons">
          <CustomButton
            text="Nova Despesa"
            icon={<FaPlus />}
            onClick={() => abrirModalDespesa()}
            className="my-custom-class"
          />
        </div>
      </div>
    </div>
  </div>
);