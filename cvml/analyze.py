# cvml/analyze.py
# 画像解析および機械学習関連の処理を記述するファイルです。
# 主に、衣類アイテムの画像から特徴を抽出する機能を担当します。

import cv2
import numpy as np
from PIL import Image
import os
import json
import requests
from typing import Dict, List, Tuple, Optional
import logging
import sys

# ログ設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ClothingImageAnalyzer:
    """衣類画像解析クラス"""
    
    def __init__(self):
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.bmp']
        
    def analyze_image(self, image_path: str) -> Dict:
        """
        画像パスを受け取り、解析結果を返す関数
        
        Args:
            image_path (str): 解析対象の画像ファイルへのパス
            
        Returns:
            dict: 解析結果（例: 色、カテゴリ、パターンなど）
        """
        try:
            if not self._validate_image_path(image_path):
                raise ValueError(f"無効な画像パス: {image_path}")
            
            logger.info(f"画像を解析中: {image_path}")
            
            # 画像を読み込み
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"画像を読み込めませんでした: {image_path}")
            
            # 各種解析を実行
            color_analysis = self._analyze_colors(image)
            pattern_analysis = self._analyze_patterns(image)
            category_analysis = self._analyze_category(image)
            
            result = {
                "image_path": image_path,
                "colors": color_analysis,
                "pattern": pattern_analysis,
                "category": category_analysis,
                "confidence_score": self._calculate_confidence(color_analysis, pattern_analysis, category_analysis),
                "image_dimensions": {
                    "width": image.shape[1],
                    "height": image.shape[0]
                }
            }
            
            logger.info(f"解析完了: {result}")
            return result
            
        except Exception as e:
            logger.error(f"画像解析エラー: {e}")
            return {
                "error": str(e),
                "image_path": image_path,
                "success": False
            }
    
    def _validate_image_path(self, image_path: str) -> bool:
        """画像パスの検証"""
        if not os.path.exists(image_path):
            return False
        
        _, ext = os.path.splitext(image_path.lower())
        return ext in self.supported_formats
    
    def _analyze_colors(self, image: np.ndarray) -> Dict:
        """色分析"""
        try:
            # BGR から RGB に変換
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # 画像をリサイズして処理を高速化
            resized = cv2.resize(rgb_image, (100, 100))
            pixels = resized.reshape(-1, 3)
            
            # 主要な色を抽出（K-means クラスタリング）
            from sklearn.cluster import KMeans
            
            n_colors = 5
            kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            colors = kmeans.cluster_centers_.astype(int)
            labels = kmeans.labels_
            
            # 各色の出現頻度を計算
            color_percentages = []
            for i in range(n_colors):
                percentage = np.sum(labels == i) / len(labels) * 100
                color_percentages.append({
                    "rgb": colors[i].tolist(),
                    "percentage": round(percentage, 2),
                    "color_name": self._get_color_name(colors[i])
                })
            
            # 出現頻度順にソート
            color_percentages.sort(key=lambda x: x["percentage"], reverse=True)
            
            return {
                "dominant_colors": color_percentages,
                "primary_color": color_percentages[0]["color_name"] if color_percentages else "不明"
            }
            
        except Exception as e:
            logger.error(f"色分析エラー: {e}")
            return {"primary_color": "不明", "error": str(e)}
    
    def _get_color_name(self, rgb: np.ndarray) -> str:
        """RGB値から色名を取得"""
        color_map = {
            "赤": [255, 0, 0],
            "青": [0, 0, 255],
            "緑": [0, 255, 0],
            "黄": [255, 255, 0],
            "紫": [128, 0, 128],
            "オレンジ": [255, 165, 0],
            "ピンク": [255, 192, 203],
            "茶": [165, 42, 42],
            "グレー": [128, 128, 128],
            "黒": [0, 0, 0],
            "白": [255, 255, 255]
        }
        
        min_distance = float('inf')
        closest_color = "不明"
        
        for color_name, color_rgb in color_map.items():
            distance = np.linalg.norm(rgb - np.array(color_rgb))
            if distance < min_distance:
                min_distance = distance
                closest_color = color_name
        
        return closest_color
    
    def _analyze_patterns(self, image: np.ndarray) -> Dict:
        """パターン分析"""
        try:
            # グレースケール変換
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # エッジ検出
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            
            # テクスチャ分析（簡易版）
            texture_analysis = self._analyze_texture(gray)
            
            # パターンの判定
            if edge_density > 0.15:
                if texture_analysis["repetitive"]:
                    pattern = "ストライプ"
                else:
                    pattern = "複雑な柄"
            elif edge_density > 0.05:
                pattern = "シンプルな柄"
            else:
                pattern = "無地"
            
            return {
                "pattern_type": pattern,
                "edge_density": round(edge_density, 4),
                "texture_score": texture_analysis["score"]
            }
            
        except Exception as e:
            logger.error(f"パターン分析エラー: {e}")
            return {"pattern_type": "不明", "error": str(e)}
    
    def _analyze_texture(self, gray_image: np.ndarray) -> Dict:
        """テクスチャ分析"""
        try:
            # ラプラシアンフィルタでテクスチャの変化を検出
            laplacian = cv2.Laplacian(gray_image, cv2.CV_64F)
            texture_variance = np.var(laplacian)
            
            # FFTで周期性を検出
            f_transform = np.fft.fft2(gray_image)
            f_shift = np.fft.fftshift(f_transform)
            magnitude_spectrum = np.log(np.abs(f_shift) + 1)
            
            # 周期性の判定（簡易版）
            repetitive = texture_variance > 500
            
            return {
                "score": round(texture_variance, 2),
                "repetitive": repetitive
            }
            
        except Exception as e:
            logger.error(f"テクスチャ分析エラー: {e}")
            return {"score": 0, "repetitive": False}
    
    def _analyze_category(self, image: np.ndarray) -> Dict:
        """カテゴリ分析（基本的な形状分析）"""
        try:
            # グレースケール変換
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # 二値化
            _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
            
            # 輪郭検出
            contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                return {"category": "不明", "confidence": 0.0}
            
            # 最大の輪郭を取得
            largest_contour = max(contours, key=cv2.contourArea)
            
            # アスペクト比を計算
            x, y, w, h = cv2.boundingRect(largest_contour)
            aspect_ratio = w / h
            
            # 面積比を計算
            contour_area = cv2.contourArea(largest_contour)
            bounding_area = w * h
            fill_ratio = contour_area / bounding_area if bounding_area > 0 else 0
            
            # カテゴリの推定（簡易版）
            category = self._estimate_category(aspect_ratio, fill_ratio)
            
            return {
                "category": category,
                "aspect_ratio": round(aspect_ratio, 2),
                "fill_ratio": round(fill_ratio, 2),
                "confidence": 0.7  # 簡易実装のため固定値
            }
            
        except Exception as e:
            logger.error(f"カテゴリ分析エラー: {e}")
            return {"category": "不明", "confidence": 0.0, "error": str(e)}
    
    def _estimate_category(self, aspect_ratio: float, fill_ratio: float) -> str:
        """アスペクト比と塗りつぶし比率からカテゴリを推定"""
        if aspect_ratio > 1.5:
            return "ボトムス"
        elif aspect_ratio < 0.7:
            return "トップス"
        elif fill_ratio > 0.8:
            return "アウター"
        else:
            return "トップス"
    
    def _calculate_confidence(self, color_analysis: Dict, pattern_analysis: Dict, category_analysis: Dict) -> float:
        """総合信頼度スコアを計算"""
        scores = []
        
        # 色分析の信頼度
        if "error" not in color_analysis and color_analysis.get("primary_color") != "不明":
            scores.append(0.8)
        else:
            scores.append(0.3)
        
        # パターン分析の信頼度
        if "error" not in pattern_analysis and pattern_analysis.get("pattern_type") != "不明":
            scores.append(0.7)
        else:
            scores.append(0.4)
        
        # カテゴリ分析の信頼度
        if "error" not in category_analysis:
            scores.append(category_analysis.get("confidence", 0.5))
        else:
            scores.append(0.2)
        
        return round(sum(scores) / len(scores), 2)

class APIConnector:
    """バックエンド API との連携クラス"""
    
    def __init__(self, api_base_url: str = "http://localhost:8080"):
        self.api_base_url = api_base_url
    
    def send_analysis_result(self, item_id: int, analysis_result: Dict) -> bool:
        """解析結果をバックエンドに送信"""
        try:
            endpoint = f"{self.api_base_url}/api/analysis"
            payload = {
                "wardrobe_item_id": item_id,
                "analysis_type": "comprehensive",
                "result_data": analysis_result,
                "confidence_score": analysis_result.get("confidence_score", 0.0)
            }
            
            response = requests.post(endpoint, json=payload)
            response.raise_for_status()
            
            logger.info(f"解析結果をAPIに送信完了: item_id={item_id}")
            return True
            
        except Exception as e:
            logger.error(f"API送信エラー: {e}")
            return False

def train_model():
    """機械学習モデルのトレーニングを行う関数（プレースホルダー）"""
    logger.info("モデルのトレーニングを開始します...")
    # TODO: ここにモデルのトレーニングロジックを実装します。
    # 例: TensorFlowやPyTorchを使った深層学習モデル
    logger.info("モデルのトレーニングが完了しました。")

def main():
    """
    メイン関数
    コマンドライン引数からの画像解析とテストを実行
    """
    if len(sys.argv) < 2:
        print("使用法: python analyze.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    analyzer = ClothingImageAnalyzer()
    result = analyzer.analyze_image(image_path)
    
    # JSON形式で結果を出力（バックエンドからの呼び出し用）
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
