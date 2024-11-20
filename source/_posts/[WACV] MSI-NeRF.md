title: [WACV2025] MSI-NeRF: Linking Omni-Depth with View Synthesis through Multi-Sphere Image aided Generalizable Neural Radiance Field
date: 2024-11-19 10:40:12
categories: 日常
tags: []
toc: true
---

## Our Paper is accepted by WACV! ##

Title: **MSI-NeRF: Linking Omni-Depth with View Synthesis through Multi-Sphere Image aided Generalizable Neural Radiance Field**

github link: [github.com/HITSZ-NRSL/MSI-NeRF](https://github.com/HITSZ-NRSL/MSI-NeRF)

arxiv link: [arxiv.org/abs/2403.10840](https://arxiv.org/abs/2403.10840)

<p align="center">
  <img width="100%" src="https://github.com/HITSZ-NRSL/MSI-NeRF/raw/main/assets/main.png"/>
</p>

Panoramic observation using fisheye cameras is significant in virtual reality (VR) and robot perception. However, panoramic images synthesized by traditional methods lack depth information and can only provide three degrees-of-freedom (3DoF) rotation rendering in VR applications. To fully preserve and exploit the parallax information within the original fisheye cameras, we introduce MSI-NeRF, which combines deep learning omnidirectional depth estimation and novel view synthesis. We construct a multi-sphere image as a cost volume through feature extraction and warping of the input images. We further build an implicit radiance field using spatial points and interpolated 3D feature vectors as input, which can simultaneously realize omnidirectional depth estimation and 6DoF view synthesis. Leveraging the knowledge from depth estimation task, our method can learn scene appearance by source view supervision only. It does not require novel target views and can be trained conveniently on existing panorama depth estimation datasets. Our network has the generalization ability to reconstruct unknown scenes efficiently using only four images. Experimental results show that our method outperforms existing methods in both depth estimation and novel view synthesis tasks.

If you find this work useful, please cite:
```bibtex
@article{yan2024msi,
  title={MSI-NeRF: Linking Omni-Depth with View Synthesis through Multi-Sphere Image aided Generalizable Neural Radiance Field},
  author={Yan, Dongyu and Huang, Guanyu and Quan, Fengyu and Chen, Haoyao},
  journal={arXiv preprint arXiv:2403.10840},
  year={2024}
}
```