import { useRef, useCallback } from "react";
import { Card, Button, Row, Col } from "antd";
import { Download, Award, Users, Leaf, Scale, Package } from "lucide-react";

interface ProofData {
  donatedItems: number;
  helpedPeople: number;
  carbonReduction: number;
  merchantName: string;
  generateDate: string;
}

interface ProofOfImpactProps {
  data?: ProofData;
}

const defaultData: ProofData = {
  donatedItems: 1250,
  helpedPeople: 386,
  carbonReduction: 2.8,
  merchantName: "扬名爱心商户",
  generateDate: new Date().toLocaleDateString("zh-CN"),
};

export const ProofOfImpact: React.FC<ProofOfImpactProps> = ({
  data = defaultData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "#FEFCE8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#FEFCE8");
    gradient.addColorStop(1, "#FEF9E3");
    ctx.fillStyle = gradient;
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = "#1E3A8A";
    ctx.font = "bold 42px 'Noto Serif SC', 'SimSun', serif";
    ctx.textAlign = "center";
    ctx.fillText("公益贡献证书", canvas.width / 2, 120);

    ctx.fillStyle = "#D97706";
    ctx.font = "16px 'Noto Serif SC', 'SimSun', serif";
    ctx.fillText("━".repeat(30), canvas.width / 2, 145);

    ctx.fillStyle = "#374151";
    ctx.font = '20px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(`授予：${data.merchantName}`, canvas.width / 2, 200);

    ctx.font = '26px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillText("感谢您对公益事业的无私贡献", canvas.width / 2, 260);

    ctx.fillStyle = "#475569";
    ctx.font = '16px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(
      "特此证明以下公益成果：",
      canvas.width / 2,
      310
    );

    const statsY = 370;
    ctx.font = 'bold 36px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#1E40AF";
    ctx.fillText(
      `${data.donatedItems.toLocaleString()} 件`,
      canvas.width / 2 - 180,
      statsY
    );
    ctx.font = '14px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#64748B";
    ctx.fillText("捐赠物资", canvas.width / 2 - 180, statsY + 30);

    ctx.font = 'bold 36px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#059669";
    ctx.fillText(
      `${data.helpedPeople.toLocaleString()} 人`,
      canvas.width / 2,
      statsY
    );
    ctx.font = '14px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#64748B";
    ctx.fillText("帮助人数", canvas.width / 2, statsY + 30);

    ctx.font = 'bold 36px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#10B981";
    ctx.fillText(
      `${data.carbonReduction} 吨`,
      canvas.width / 2 + 180,
      statsY
    );
    ctx.font = '14px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = "#64748B";
    ctx.fillText("碳减排量", canvas.width / 2 + 180, statsY + 30);

    ctx.strokeStyle = "#B91C1C";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 490, 70, 35, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#DC2626";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 490, 60, 28, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#DC2626";
    ctx.font = 'bold 14px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = "center";
    ctx.fillText("扬名街道公益项目", canvas.width / 2, 485);
    ctx.font = '12px "Noto Serif SC", "SimSun", serif';
    ctx.fillText("监制", canvas.width / 2, 502);

    ctx.fillStyle = "#94A3B8";
    ctx.font = '12px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(
      `证明生成日期：${data.generateDate}`,
      canvas.width / 2,
      550
    );
    ctx.fillText(
      "本证明仅供公益宣传使用，不作为法律凭证",
      canvas.width / 2,
      570
    );

    const link = document.createElement("a");
    link.download = `公益贡献证书_${data.generateDate.replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [data]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Card
        style={{
          borderRadius: "12px",
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          border: "1px solid #FDE68A",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
              marginBottom: "16px",
              boxShadow: "0 8px 16px rgba(217, 119, 6, 0.3)",
            }}
          >
            <Award size={32} color="white" />
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#92400E",
              marginBottom: "8px",
            }}
          >
            公益贡献证明
          </h3>
          <p style={{ fontSize: "14px", color: "#B45309", marginBottom: "24px" }}>
            下载您的公益贡献证书，用于企业宣传
          </p>
        </div>

        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={8}>
            <div
              style={{
                textAlign: "center",
                padding: "16px 8px",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "8px",
              }}
            >
              <Package
                size={24}
                color="#1E40AF"
                style={{ marginBottom: "8px" }}
              />
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1E40AF",
                }}
              >
                {data.donatedItems.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>捐赠物资</div>
            </div>
          </Col>
          <Col span={8}>
            <div
              style={{
                textAlign: "center",
                padding: "16px 8px",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "8px",
              }}
            >
              <Users size={24} color="#059669" style={{ marginBottom: "8px" }} />
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#059669",
                }}
              >
                {data.helpedPeople.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>帮助人数</div>
            </div>
          </Col>
          <Col span={8}>
            <div
              style={{
                textAlign: "center",
                padding: "16px 8px",
                background: "rgba(255, 255, 255, 0.6)",
                borderRadius: "8px",
              }}
            >
              <Leaf
                size={24}
                color="#10B981"
                style={{ marginBottom: "8px" }}
              />
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#10B981",
                }}
              >
                {data.carbonReduction}
              </div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>碳减排(吨)</div>
            </div>
          </Col>
        </Row>

        <Button
          type="primary"
          size="large"
          icon={<Download size={18} />}
          onClick={handleDownload}
          block
          style={{
            height: "52px",
            fontSize: "16px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
            border: "none",
            boxShadow: "0 4px 12px rgba(217, 119, 6, 0.4)",
          }}
        >
          下载公益证明
        </Button>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#B45309",
            marginTop: "12px",
            marginBottom: 0,
          }}
        >
          <Scale size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
          证明仅供公益宣传使用，不作为法律凭证
        </p>
      </Card>
    </>
  );
};
