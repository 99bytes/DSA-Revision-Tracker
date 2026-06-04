import sys
from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Make white background transparent
    datas = img.getdata()
    newData = []
    for item in datas:
        # If it's pure white or very close to white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Resize to 64x64
    img = img.resize((64, 64), Image.Resampling.LANCZOS)
    
    img.save(output_path, "PNG")
    print(f"Saved processed cursor to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
