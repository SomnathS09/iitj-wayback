#!/bin/bash
#SBATCH --job-name=test-gpu            # Job name
#SBATCH --partition=fat                # Partition Name
#SBATCH --nodes=1                      # Use one node
#SBATCH --gres=gpu:1                   # Request 2 GPU (adjust if needed)
#SBATCH --ntasks=1                     # Single task
#SBATCH --cpus-per-task=2              # Number of CPU cores per task
#SBATCH --mem=16gb                     # Memory limit
#SBATCH --time=05:00:00                # Time limit (HH:MM:SS)
#SBATCH --output=output_%j.log         # Standard output and error log
#SBATCH --mail-type=all
#SBATCH --mail-user=m24cse***@iitj.ac.in
##### S B ATCH --error=slurm-%x-%j.err 

source ~/.bashrc
module load anaconda3
source activate dl-gpu
# Add FFmpeg to PATH for this job
export PATH=$HOME/ffmpeg:$PATH

echo "==== Current node: ${SLURM_NODELIST} ===="
echo "==== Home dir: ${HOME}, Working dir: $PWD ===="
nvidia-smi

port=$(shuf -i 6000-9999 -n 1)
/usr/bin/ssh -vvv -N -f -R $port:localhost:$port login

cat<<EOF
Jupyter server is running on: $(hostname)
Job starts at: $(date)
ssh -L $port:localhost:$port $USER@hpclogin.iitj.ac.in
EOF

unset XDG_RUNTIME_DIR
if [ "$SLURM_JOBTMP" != "" ]; then
    export XDG_RUNTIME_DIR=$SLURM_JOBTMP
fi

# node=$(hostname -s)
# user=$(whoami)

jupyter lab --no-browser --port $port --notebook-dir=$(pwd) 

# pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
# pip3 install -r requirements.txt
# python --version

# python -c "import tensorflow as tf; print(tf.config.list_physical_devices())"
# python -c "import torch; print(torch.cuda.is_available());"